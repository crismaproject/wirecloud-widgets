angular.module('worldStateSaver.icmm', ['worldStateSaver.wirecloud'])
    .service('icmm', ['$q', '$http', 'wirecloud', function($q, $http, wirecloud) {
        return {
            icmm: wirecloud.getPreference('icmm', 'http://crisma.cismet.de/pilotC/icmm_api'),

            /**
             * @param {string} resource
             * @private
             * @returns {promise}
             */
            getNextId: function(resource) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(this.icmm + '/CRISMA.' + resource + '?omitNullValues=true&limit=1000')
                    .success(function(data) {
                        var id = 1;
                        var ids = data['$collection']
                            .forEach(function(x) {
                                var ref = x['$ref'];
                                var match = /\/(\d+)$/.exec(ref);
                                if (match) {
                                    var thisId = parseInt(match[1]);
                                    if (thisId >= id) id = thisId + 1;
                                }
                            });
                        deferred.resolve(id);
                    })
                    .error(function() { deferred.reject(); });
                return promise;
            },

            /**
             * Inserts a new world state into the ICMM.
             * @param {*} worldState
             * @param {*} parentWorldState
             * @returns {promise}
             */
            insertWorldState: function(worldState, parentWorldState) {

                //
                // FIXME: ICMM insertion still fails!
                //

                var $me = this;
                var deferred = $q.defer();
                var promise = deferred.promise;
                var $httpOptions = {
                    transformRequest: function (data) {
                        return JSON.stringify(data, function (k, v) {
                            // angular strips $ vars by default
                            return k.substring(0, 1) === '$' && !(k === '$self' || k === '$ref') ? undefined : v;
                        });
                    }
                };

                $q
                    .all([$me.getNextId('worldstates'), $me.getNextId('transitions'), $me.getNextId('dataitems')])
                    .then(function(ids) {
                        var icmmWs = $me.buildNewWorldState(parentWorldState['$icmm'].id, worldState.id, ids[0], ids[1], ids[2]);
                        deferred.notify({status: 'Created world state object', data: icmmWs});
                        $http.put($me.icmm + '/CRISMA.worldstates/' + ids[0], icmmWs, $httpOptions)
                            .then(function() {
                                deferred.notify({status: 'Inserted world state object', data: icmmWs});
                                var parentIcmmWsUrl = $me.icmm + '/CRISMA.worldstates/' + parentWorldState['$icmm'].id + '?deduplicate=true&level=1';
                                $http.get(parentIcmmWsUrl)
                                    .then(function(parentIcmmWs) {
                                        if (!parentIcmmWs.hasOwnProperty('childworldstates'))
                                            parentIcmmWs.childworldstates = [];
                                        parentIcmmWs.childworldstates.push({ '$ref': '/CRISMA.worldstates/' + ids[0] });
                                        $http.put(parentIcmmWsUrl, parentIcmmWs, $httpOptions)
                                            .then(function () {
                                                deferred.resolve(ids[0]);
                                            }, deferred.reject);
                                    }, deferred.reject);
                            }, deferred.reject);
                    }, deferred.reject);

                return promise;
            },

            /**
             * Builds a new ICMM world state object using the specified identifiers.
             * @param {number} wsParentId the ICMM ID of the parent world state
             * @param {number} ooiwsrId the OOIWSR ID of this world state
             * @param {number} newIcmmId the ICMM ID of this world state
             * @param {number} transitionId the transition ID used in this world state
             * @param {number} dataItemId the data item ID used to describe this world state
             * @private
             * @returns {Object}
             */
            buildNewWorldState: function (wsParentId, ooiwsrId, newIcmmId, transitionId, dataItemId) {
                var now = new Date();
                return {
                    '$self': '/CRISMA.worldstates/' + newIcmmId,
                    'id': newIcmmId,
                    'name': 'WS ' + ooiwsrId,
                    'description': 'Generated world state',
                    'categories': [ { '$ref': '/CRISMA.categories/2' } ],
                    'creator': 'Wirecloud',
                    'created': now,
                    'origintransition': {
                        '$self': '/CRISMA.transitions/' + transitionId,
                        'id': transitionId,
                        'name': 'Initial transition',
                        'description': 'This worldstate was created manually by a decision-maker.',
                        'simulationcontrolparameter': null,
                        'transitionstatuscontenttype': 'application/json',
                        'transitionstatus': '{"status":"finished"}',
                        'performedsimulation': null,
                        'performedmanipulation': {
                            '$ref': '/CRISMA.manipulationdescriptors/1'
                        }
                    },
                    'worldstatedata': [
                        {
                            '$self': '/CRISMA.dataitems/' + dataItemId,
                            'id': dataItemId,
                            'name': 'Test baseline',
                            'description': 'Baseline to test ICMM integration',
                            'lastmodified': now,
                            'categories': [
                                {
                                    '$ref': '/CRISMA.categories/5'
                                }
                            ],
                            'datadescriptor': {
                                '$ref': '/CRISMA.datadescriptors/1'
                            },
                            'actualaccessinfocontenttype': 'application/json',
                            'actualaccessinfo': '{"id":"' + ooiwsrId + '", "resource":"worldstate"}'
                        }
                    ],
                    'parentworldstate': {
                        '$ref': '/CRISMA.worldstates/' + wsParentId
                    },
                    'childworldstates': []
                };
            }
        };
    }]);