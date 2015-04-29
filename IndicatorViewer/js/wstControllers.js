// see http://codepen.io/odiseo42/pen/bCwkv

var WstApp = angular.module ('wstApp', ['ngResource', 'eu.crismaproject.pilotE.linechart']);

WstApp.factory('wirecloud', function () {
        return {
            getPreference: function (name, fallback) {
                return typeof MashupPlatform !== 'undefined' ? MashupPlatform.prefs.get(name) : fallback;
            },

            on: function (event, callback) {
                if (typeof MashupPlatform !== 'undefined')
                    MashupPlatform.wiring.registerCallback(event, callback);
                else if (!this.hasOwnProperty('$warned' + event)) {
                    this['$warned' + event] = true;
                    var dummyFunctionName = 'wcTriggerEv_' + event;
                    console.warn('Wirecloud not detected. Use injected method window.' + dummyFunctionName + ' (event_data) to trigger this event manually manually.');
                    window[dummyFunctionName] = callback;
                }
            },

            send: function (wiringName, data) {
                if (typeof MashupPlatform !== 'undefined') {
                    if (typeof data !== 'string')
                        data = JSON.stringify(data);
                    MashupPlatform.wiring.pushEvent(wiringName, data);
                } else {
                    if (!this.hasOwnProperty('$warned')) {
                        this['$warned'] = true;
                        console.warn('Wirecloud is not available. Data sent to OutputEndpoints will be sent to the console instead.');
                    }
                    console.log([wiringName, data]);
                }
            },

			proxyFor: function (url) {
				return typeof (MashupPlatform) === 'undefined' ? url : MashupPlatform.http.buildProxyURL(url);
			}
        }
    })
    .factory('icmm', ['$http', '$resource', 'wirecloud', function ($http, $resource, wirecloud) {
		var icmmUri = wirecloud.proxyFor(wirecloud.getPreference('icmm'));
		if (!icmmUri) {
            throw 'No ICMM API URI configured!';
        } else {
			var icmmWsUri = icmmUri + '/CRISMA.worldstates/:baselineId';
			return $resource(icmmWsUri, { baselineId: '@id' }, {
				query: {
					method: 'GET',
					isArray: true,
					params: {
						// level: 3,
						fields: 'id, name, description, parentworldstate, childworldstates, worldstatedata, simulatedTime, created, categories, actualaccessinfo',
						deduplicate: true,
						omitNullValues: false,
						limit: 500,
						level: 4
					},
					transformResponse: function (data) {
						if (data === null) {
							throw 'Got no WorldState data!';
						} else {
							var wsObj = JSON.parse(data);
							var list = [];
							var pushChildren = function(parent, list) {
								for (var i = 0; i < parent.childworldstates.length; i++) {
									pushChildren(parent.childworldstates[i], list);
								}
								list.push(parent);
							};
							pushChildren(wsObj, list);
							return list;
						}
					}
				}
			});
		}
    }])
    .controller('treeCtrl', ['$scope', '$http', 'icmm', 'wirecloud', function ($scope, $http, icmm, wirecloud) {
    
	$scope.showTreeGraph = wirecloud.getPreference('showTree');
	$scope.showTimeline = wirecloud.getPreference('showTimeline');
	$scope.showIndicatorBars = wirecloud.getPreference('showChart');
	$scope.showLinechart = wirecloud.getPreference('showLinechart');
	$scope.showGroupSelect = wirecloud.getPreference('showGroupBy');

    $scope.worldStateList = [];
    $scope.baselines = [];
    $scope.baseline = null;
    $scope.baselineSelected = 0;
	$scope.worldstateId = 0;

    $scope.treeData = {};
    $scope.selectedWorldStates = []; // list of ids

    $scope.indicators = {};
    $scope.indicators2 = {};
    
    $scope.groupIndicatorsByWorldstate = 1;
    $scope.groupIndicatorsBy = "worldstate";

    // comunication between graphs
    $scope.minTime = null;
    $scope.maxTime = null;

    $scope.spinner = new Spinner();

	$scope.loadWorldStates = function () {
		$('#wsTree').spin(true);
		icmm.query({baselineId: $scope.baseline.id})
			.$promise.then(function (list) {
				$('#wsTree').spin(false);
				$scope.worldStateList = list;
				if ($scope.showTreeGraph) {
					$scope.createWorldStateTree();
				} else {
					var ws = [];
					ws.push($scope.baseline.id);
					$scope.selectWorldStates(ws);
				}
			});
	};

    $scope.createWorldStateTree = function () {
		$scope.selectedWorldStates = [];
		$scope.indicators = {};
		if ($scope.baseline == null) {
			throw 'No WorldState selected!';
		} else {
			// createWorldStateTree("#worldstate-tree", $scope.baseline.worldStateId, $scope.worldStateList, $scope.selectWorldStates);
			$scope.treeData = createTreeData ($scope.baseline.id, $scope.worldStateList);
			$scope.$apply();
			$scope.baselineSelected = 1;
		}
    };

    // 2014-04-15: in the following color is replaced by cssClass; default is indicators-indicatorId[-key]
    var testIndicators = {
	"82":[
	    {"worldstates":[81],"description":"Number of patients with life status less then 20","data":0,"type":"number","id":"deathsIndicator","name":"Deaths"},
	    {"worldstates":[81],"description":"Life status categoized and summed up per category",
	     "data":[{"color":"#000000","value":0,"key":"dead","desc":"life status below 10"},
		     {"color":"#ff0000","value":7,"key":"red","desc":"life status 10..50"},
		     {"color":"yellow","value":33,"key":"yellow","desc":"life status 50..85"},
		     {"color":"#00FF00","value":10,"key":"green","desc":"live status 85 or better"}],
	     "type":"histogram","id":"lifeIndicator","name":"health status summary"},
	    {"worldstates":[59,81],"description":"Number of patients with actual life status less then base life status - 50","data":0,"type":"number","id":"seriouslyDeterioratedIndicator","name":"Seriously deteriorated"},
	    {"worldstates":[59,81],"description":"Number of patients with actual life status better or equal then base life status","data":50,"type":"number","id":"improvedIndicator","name":"improved"},
	    {"id":"timeIntervalsTest",
	     "name":"Just some test data",
	     "description":"List of time intervals",
	     "worldstates":[59,81],
	     "type":"timeintervals",
	     "data": {
		 intervals: [
		     {
			 startTime: "2012-01-01T12:19:00.000",
			 endTime: "2012-01-01T12:24:00.000",
		     },
		     {
			 startTime: "2012-01-01T12:41:00.000",
			 endTime: "2012-01-01T12:45:00.000",
		     }
		 ],
		 color: "#00cc00",
		 linewidth: 2
		 // stroke
		 // heads: [circle, arrow
	     }
	    },
	    {"id":"timeIntervalsTest2",
	     "name":"Just some other test data",
	     "description":"List of time intervals",
	     "worldstates":[59,81],
	     "type":"timeintervals",
	     "data": {
		 intervals: [
		     {
			 startTime: "2012-01-01T12:10:00.000",
			 endTime: "2012-01-01T12:19:00.000",
		     }
		 ],
		 color: "#0000cc",
		 linewidth: 2
	     }
	    }
	]};


    $scope.selectWorldStates = function (wsIdList) {
		console.log ("selectWS (" + JSON.stringify (wsIdList) + ")");
		$scope.selectedWorldStates = wsIdList;
		// now get e.g. indicators
    	$scope.indicators = {};
    	$scope.indicators2 = {};
		$scope.loadIndicatorValues ($scope.selectedWorldStates, 0);
    };

    var tmpIndicators;
    $scope.loadIndicatorValues = function (wsIds, index) {
		if (index === 0) {
			// start
			tmpIndicators = {};
			// console.log ("start, wsIds = " + JSON.stringify (wsIds));
			// console.log ("start, tmpIndicators = " + JSON.stringify (tmpIndicators));
		} 
		if ((wsIds != null) && (index < wsIds.length)) {
			var wsid = wsIds[index];
			// search for ws in worldStateList
			for (var i = 0; i < $scope.worldStateList.length; i++) {
				if ($scope.worldStateList[i].id === wsid) {
					// get array of worldstatedata
					var wsData = $scope.worldStateList[i].worldstatedata;
					var valuesUnsorted = [];
					for (var j = 0; j < wsData.length; j++) {
						// check category of wsData item
						if (wsData[j].categories && wsData[j].categories.length > 0) {
							for (var k = 0; k < wsData[j].categories.length; k++) {
								if (wsData[j].categories[k].id === 4) {
									// icmm indicator
									var indicatorObject = JSON.parse(wsData[j].actualaccessinfo);
									if ($scope.indicatorFilter != undefined) {
										for (var i = 0; i < $scope.indicatorFilter.length; i++) {
											if ($scope.indicatorFilter[i].id == indicatorObject.id) {
												valuesUnsorted.push(indicatorObject);
											}
										}
									} else {
										valuesUnsorted.push(indicatorObject);
									}
								}
							}
						}
					}
					if (valuesUnsorted.length > 0) {
						var values = [];
						if ($scope.indicatorFilter != undefined) {
							// sort values according to filter:
							for (var i = 0; i < $scope.indicatorFilter.length; i++) {
								for (var j = 0; j < valuesUnsorted.length; j++) {
									if (valuesUnsorted[j].id == $scope.indicatorFilter[i].id) {
										values.push(valuesUnsorted[j]);
										var k = values.length-1;
										values[k].data.color = $scope.indicatorFilter[i].color;
										values[k].data.enabled = $scope.indicatorFilter[i].enabled;
										values[k].displayText = $scope.indicatorFilter[i].displayText;
									}
								}
							}							
						} else{
							values = valuesUnsorted;
						}
						tmpIndicators[wsid] = values;
					}
					$scope.loadIndicatorValues (wsIds, index + 1);
				}
			}
		} 
		if ((wsIds != null) && (index == wsIds.length)) {
			// end
			console.log ("end,   tmpIndicators = " + JSON.stringify (tmpIndicators));
			$scope.indicators = tmpIndicators;
			$scope.indicators2 = tmpIndicators;
			$scope.$apply();
		}
    };

    $scope.selectIndicators = function (indList) {
		console.log ("selected_indicators (" + JSON.stringify (indList) + ")");
		wirecloud.send('selected_indicators', indList);
    };


    $scope.test = function () {
		console.log ("test: selectedWorldStates: " + JSON.stringify ($scope.selectedWorldStates));
		console.log ("test: minTime: " + JSON.stringify ($scope.minTime));
		console.log ("test: maxTime: " + JSON.stringify ($scope.maxTime));
		// $scope.indicators = testIndicators;
		console.log ("test: groupIndicatorsByWorldstate: " + $scope.groupIndicatorsByWorldstate);
    };
	
	wirecloud.on('indicator_filter', function (filter) {
		$scope.indicatorFilter = JSON.parse(filter);
	});
	
	wirecloud.on('basic_worldstate', function (base_ws) {
		$scope.baseline = JSON.parse(base_ws);
		$scope.worldstateId = $scope.baseline.id;
//		$scope.$apply();
		$scope.loadWorldStates();
	});

}]).config(
    [
        '$provide',
        function ($provide) {
            'use strict';

            var mashupPlatform;

            if (typeof MashupPlatform === 'undefined') {
                console.log('mashup platform not available');
            } else {
                // enable minification
                mashupPlatform = MashupPlatform;
				var url = mashupPlatform.prefs.get('icmm');
                $provide.constant('ICMM_API', mashupPlatform.http.buildProxyURL(url));
            }
        }
    ]
);
