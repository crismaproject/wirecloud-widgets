angular.module('icmmWorldStatePickerApp', ['ngResource', 'ya.treeview', 'ya.treeview.tpls', 'ngDialog'])
    .factory('wirecloud', function () {
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
		var icmmUri = "http://crisma.cismet.de/pilotEv2/staging/icmm_api";
		icmmUri = wirecloud.proxyFor(wirecloud.getPreference('icmm', icmmUri));
		if (!icmmUri) {
            throw 'No ICMM API URI configured!';
        } else {
			var level = wirecloud.getPreference('level', 1);
			if (!level || level < 1) {
				level = 1;
			}
			var category = wirecloud.getPreference('category', 1);
			var leaves_only = wirecloud.getPreference('leaves_only', false);
			var icmmWsUri = icmmUri + '/CRISMA.worldstates';
			return $resource(icmmWsUri, null, {
				query: {
					method: 'GET',
					isArray: true,
					params: {
						level: level,
						fields: 'id, name, description, parentworldstate, childworldstates, ooiRepositorySimulationId',
						deduplicate: false,
						omitNullValues: false,
						limit: 99999,
						filter: (category == '' ? 'categories:.*' : 'categories:.*' + category + '.*') + (leaves_only == true ? ',childworldstates:\\[\\]' : '')
					},
					transformResponse: function (data) {
						var ret = [];
						if (data != undefined && data != "") {
							var col = JSON.parse(data).$collection;
							checkCategory = function(categories, cat) {
								if (cat >= 0 && categories && categories.length > 0) {
									for (var c = 0; c < categories.length; c++) {
										if (categories[c].id == cat) {
											return true;
										}
									}
								}
								return false;
							};
							getChildTree = function(parent, l, max) {
								var ret = [];
								if (l < max && parent.childworldstates != undefined && parent.childworldstates.length > 0) {
									l++;
									for (var j = 0; j < parent.childworldstates.length; j++) {
										var child = null;
										if (parent.childworldstates[j] !== null && parent.childworldstates[j].name) {								
											child = {
												label: parent.childworldstates[j].name,
												data: parent.childworldstates[j]
											}
											child.children = getChildTree(parent.childworldstates[j], l, max);
										}
										if (child) ret.push(child);
									}
								}
								if (ret.length === 0) {
									ret = null;
								}
								return ret;
							};
							
							compare = function (a,b) {
							  if (a.ooiRepositorySimulationId < b.ooiRepositorySimulationId)
								 return -1;
							  if (a.ooiRepositorySimulationId > b.ooiRepositorySimulationId)
								return 1;
							  return 0;
							};
							col.sort(compare);
							/*
							if (category !== "" && category >= 0) {
								// get all worldstates of the given category out of the list of worldstates:
								var catWS = [];
								for (var i = 0; i < col.length; i++) {
									if (checkCategory(col[i].categories, category)) {
										catWS.push(col[i]);
									}
								}
								for (var i = 0; i < catWS.length; i++) {
									// worldstate name must be specified
									if (catWS[i].name) {
										var res = {
											label: catWS[i].name,
											data: catWS[i]									
										};									
										res.children = getChildTree(catWS[i], 1, level);
										ret.push(res);
									}
								}
							} else { // if no category is defined, all categories are taken
							*/
								for (var i = 0; i < col.length; i++) {
									// worldstate name must be specified
									if (col[i].name) {
										var simulationString = col[i].ooiRepositorySimulationId != undefined ? 'Simulation ' +  col[i].ooiRepositorySimulationId : '';
										var res = {
											label: simulationString + ': ' + col[i].name,
											data: col[i]									
										};									
										res.children = getChildTree(col[i], 1, level);
										ret.push(res);
									}
								}
//							}
						}
						return ret;
					}
				}		
			});
		}
    }])
    .controller('ICMMWorldStatePickerApp', ['$scope', 'icmm', 'wirecloud', 'ngDialog', function ($scope, icmm, wirecloud, ngDialog) {
		$scope.context = {
			selectedNodes: []
		};

		$scope.options = {
			onSelect: function($event, node, context) {
				var multi = wirecloud.getPreference('multiselect', true);
				if (multi == true && $event.ctrlKey) {
					var idx = context.selectedNodes.indexOf(node);
					if (context.selectedNodes.indexOf(node) === -1) {
						context.selectedNodes.push(node);
					} else {
						context.selectedNodes.splice(idx, 1);
					}
				} else { 
					context.selectedNodes = [node];
					wirecloud.send('worldstate', node.$model.data);
				}
				var ws_list = [];
				for (var i = 0; i < context.selectedNodes.length; i++) {
					var ws = context.selectedNodes[i];
					ws_list.push(ws.$model.data.id);
				}
				wirecloud.send('worldstate_list', ws_list);
			}
		};

		$scope.filter_term = "";
        $scope.isRefreshingWorldstates = false;

        $scope.treedata = [];
        $scope.model = [];
		
		$scope.treehandler = function(branch) {
			$scope.selectedWorldState = branch.data;
			wirecloud.send('worldstate', $scope.selectedWorldState);
		};
		
        $scope.refreshWorldStates = function () {
            $scope.isRefreshingWorldstates = true;
            icmm.query()
                .$promise.then(function (list) {
                    $scope.treedata = list;
                    $scope.model = list;
                    if (list.length) {
                        $scope.selectedWorldState = $scope.model[0].data;
                        if (list.length > 1)
                            $('#worldStateInput').focus();

                        $scope.isRefreshingWorldstates = false;
                    }
                }, function (error) {
					ngDialog.open({template:"Can not access ICMM service via given URL:\n" + wirecloud.getPreference('icmm', icmmUri), plain:true});
				});
        };

        $scope.filterTree = function (tree, filter) {
			// delete all items with label == filter:
			var item = tree;
			for (var i = 0; i < item.children.length; i++) {
				if (item.children[i].children && item.children[i].children.length > 0) {
					$scope.filterTree(item.children[i], filter);
				}
				else {
					if ((item.children[i].label.toUpperCase()).indexOf(filter.toUpperCase()) == -1) {
						item.children.remove(item.children[i]);
						i--;
					}
				}
			}
		}
        $scope.filterWorldStates = function () {
			console.log("Filter term: " + $scope.filter_term);
			// if $scope.filter_term is empty string => refresh Tree from ICMM:
			if ($scope.filter_term == undefined || $scope.filter_term == '') {
				$scope.refreshWorldStates();
			} else {
				$scope.model = angular.copy($scope.treedata);
				for (var i = 0; i < $scope.model.length; i++) {
					if ($scope.model[i].children && $scope.model[i].children.length > 0) {
						$scope.filterTree($scope.model[i], $scope.filter_term);
					}
					else {
						if (($scope.model[i].label.toUpperCase()).indexOf($scope.filter_term.toUpperCase()) == -1) {
							$scope.model.remove($scope.model[i]);
							i--;
						}				
					}
				}
			}
        };
		
		wirecloud.on('update', function (update) {
			if (update && update === 'true') {
				$scope.refreshWorldStates();
			}
		});

        $scope.refreshWorldStates();

    }]);

/**
 * Removes an element from an array.
 *
 * @param {string} the value to search and remove
 * @returns the array without the removed element;
 */
Array.prototype.remove = function(value) {
  var idx = this.indexOf(value);
  if (idx != -1) {
      return this.splice(idx, 1);
  }
  return this;
}