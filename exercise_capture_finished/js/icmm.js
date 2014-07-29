angular.module('exerciseCaptureFinishedApp.icmm', ['exerciseCaptureFinishedApp.wirecloud'])
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
                $http.get(this.icmm_direct + '/CRISMA.' + resource + '?omitNullValues=true&limit=1000000')
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
            insertWorldState: function(ws_template, ws_data, dataitem, parentId) {
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

                $q.all([$me.getNextId('worldstates'), $me.getNextId('dataitems')])
                    .then(function(ids) {
						dataitem.id = ids[1];
                        var icmmWs = $me.buildNewWorldState(ws_template, ids[0], ws_data, dataitem, parentId);
                        deferred.notify({status: 'Created world state object', data: icmmWs});
                        $http.put($me.icmm_direct + '/CRISMA.worldstates/' + ids[0], icmmWs, $httpOptions)
                            .then(function() {
                                deferred.notify({status: 'Inserted world state object', data: icmmWs});
                                var parentIcmmWsUrl = $me.icmm_direct + '/CRISMA.worldstates/' + parentId + '?deduplicate=true&level=1';
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
             * @param {number} newIcmmId the ICMM ID of this world state
             * @param {*} generic worldstate data (name, description)
             * @param {*} dataItem the data item to be stored as the first element in worldstatedata
             * @private
             * @returns {Object}
             */
            buildNewWorldState: function (wsTemplate, newIcmmId, wsData, dataItem, parentId) {
                var now = new Date();
				var worldstatedata = [];
				dataItem.$self = '/CRISMA.dataitems/' + dataItem.id;
				dataItem.lastmodified = now;
				worldstatedata.push(dataItem);
				// create dataItem for incident time
				if (wsData.incidentTime) {
					var daiIncTime = this.buildTimeDataItem(wsData.incidentTime, 'Incident', dataItem.id+1);
					worldstatedata.push(daiIncTime);
				}
				// create dataitem for reference time
				if (wsData.referenceTime) {
					var daiRefTime = this.buildTimeDataItem(wsData.referenceTime, 'Ref.Time', dataItem.id+2);
					worldstatedata.push(daiRefTime);
				}
				var newWs = wsTemplate;
				newWs.$self = '/CRISMA.worldstates/' + newIcmmId;
                newWs.id = newIcmmId;
                newWs.name = wsData.name;
                newWs.description = wsData.description;
                newWs.creator = 'Wirecloud';
                newWs.created = now;
                newWs.worldstatedata = worldstatedata;
                newWs.parentworldstate = {
                        '$ref': '/CRISMA.worldstates/' + parentId
                    },
                newWs.childworldstates = [];
                newWs.iccdata = [];
 				return newWs;
            },
			
             /**
             * Builds a new ICMM dataitem for a timestamp indicator.
             * @param {datetime} timestamp
             * @param {string} label for the timestamp
             * @private
             * @returns {Object} dataitem
             */
            buildTimeDataItem: function (time, label, id) {
				var retVal = {};
				retVal.$self = '/CRISMA.dataitems/' + id;
				retVal.id = id;
				retVal.name = label;
				retVal.datadescriptor = null;
				retVal.actualaccessinfocontenttype = 'application/json';
				var indId = label.replace(/\s/g,'');
				retVal.actualaccessinfo = JSON.stringify({
					time: time,
					type: 'timestamp',
					id: indId,
					name: label
				});
				retVal.description = label;
				retVal.lastmodified = new Date();
				retVal.categories = [];
				var category = {
					$ref: '/CRISMA.categories/4'
				};
				retVal.categories.push(category);
				return retVal;
			}
       };
    }]);