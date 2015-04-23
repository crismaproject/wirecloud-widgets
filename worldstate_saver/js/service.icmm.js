angular.module('worldStateSaver.icmm', ['worldStateSaver.wirecloud'])
    .service('icmm', ['$q', '$http', 'wirecloud', function($q, $http, wirecloud) {
        return {
            icmm_direct: wirecloud.getPreference('icmm'),

            icmm: wirecloud.proxyURL(wirecloud.getPreference('icmm')),

            /**
             * @param {string} resource
             * @private
             * @returns {promise}
             */
            getNextId: function(resource) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(this.icmm + '/nextId?class=' + resource)
                    .success(function (data) {
                        deferred.resolve(data.nextId);
                    })
                    .error(function () {
                        // fallback strategy
                        $http.get(this.icmm + '/CRISMA.' + resource + '?omitNullValues=true&limit=1000000')
                            .success(function(data) {
                                var id = 1;
                                data['$collection'].forEach(function(x) {
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
                    });
                return promise;
            },

            /**
             * Inserts a new world state into the ICMM.
             * @param {*} worldState
             * @param {*} parentWorldState
             * @returns {promise}
             */
            insertWorldState: function(worldState, parentWorldState) {
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
                        var icmmWs = $me.buildNewWorldState(parentWorldState['$icmm'], worldState.worldStateId, ids[0], ids[1], ids[2]);
                        deferred.notify({status: 'Created world state object', data: icmmWs});
                        $http.put($me.icmm + '/CRISMA.worldstates/' + ids[0], icmmWs, $httpOptions)
                            .then(function() {
                                deferred.notify({status: 'Inserted world state object', data: icmmWs});
                                var parentIcmmWsUrl = $me.icmm + '/CRISMA.worldstates/' + parentWorldState['$icmm'].id + '?deduplicate=true&level=1';
                                $http.get(parentIcmmWsUrl)
                                    .then(function(parentIcmmWs) {
                                        if (!parentIcmmWs.data.hasOwnProperty('childworldstates'))
                                            parentIcmmWs.data.childworldstates = [];
                                        parentIcmmWs.data.childworldstates.push({ '$ref': '/CRISMA.worldstates/' + ids[0] });
                                        $http.put(parentIcmmWsUrl, parentIcmmWs.data, $httpOptions)
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
             * @param {*} wsParent the ICMM instance of the parent world state
             * @param {number} ooiwsrId the OOIWSR ID of this world state
             * @param {number} newIcmmId the ICMM ID of this world state
             * @param {number} transitionId the transition ID used in this world state
             * @param {number} dataItemId the data item ID used to describe this world state
             * @private
             * @returns {Object}
             */
            buildNewWorldState: function (wsParent, ooiwsrId, newIcmmId, transitionId, dataItemId) {
                var now = new Date();
                return {
                    '$self': '/CRISMA.worldstates/' + newIcmmId,
                    'id': newIcmmId,
                    'name': 'WS ' + ooiwsrId,
                    'description': 'Wirecloud generated world state',
                    'categories': [ { '$ref': '/CRISMA.categories/2' } ],
                    'creator': 'Wirecloud',
                    'ooiRepositorySimulationId': wsParent['ooiRepositorySimulationId'],
                    'created': now,
                    'simulatedTime': wsParent['simulatedTime'],
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
                        '$ref': '/CRISMA.worldstates/' + wsParent.id
                    },
                    'childworldstates': []
                };
            }
        };
    }]);