angular.module('icmmWorldStatePickerApp', ['ngResource', 'angularBootstrapNavTree'])
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
		var icmmUri = wirecloud.proxyFor(wirecloud.getPreference('icmm'));
		if (!icmmUri) {
            throw 'No ICMM API URI configured!';
        } else {
			var level = wirecloud.getPreference('level');
			if (!level || level < 1) {
				level = 1;
			}
			var category = wirecloud.getPreference('category');
			var icmmWsUri = icmmUri + '/CRISMA.worldstates';
			return $resource(icmmWsUri, null, {
				query: {
					method: 'GET',
					isArray: true,
					params: {
						level: 3,
						// fields: 'id, name, description, parentworldstate, childworldstates',
						deduplicate: false,
						omitNullValues: false,
						limit: 500
					},
					transformResponse: function (data) {
						var col = JSON.parse(data).$collection;
						var ret = [];
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
							return ret;
						};
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
							for (var i = 0; i < col.length; i++) {
								// worldstate name must be specified
								if (col[i].name) {
									var res = {
										label: col[i].name,
										data: col[i]									
									};									
									res.children = getChildTree(col[i], 1, level);
									ret.push(res);
								}
							}
						}
						return ret;
					}
				}		
			});
		}
    }])
    .controller('ICMMWorldStatePickerApp', ['$scope', 'icmm', 'wirecloud', function ($scope, icmm, wirecloud) {
		$scope.filter_term = "";
        $scope.isRefreshingWorldstates = false;

        $scope.treedata = [];
        $scope.filtered_treedata = [];
		
		$scope.treehandler = function(branch) {
			$scope.selectedWorldState = branch.data;
			wirecloud.send('worldstate', $scope.selectedWorldState);
		};
		
        $scope.refreshWorldStates = function () {
            $scope.isRefreshingWorldstates = true;
            icmm.query()
                .$promise.then(function (list) {
                    $scope.treedata = list;
                    $scope.filtered_treedata = list;
                    if (list.length) {
                        $scope.selectedWorldState = $scope.filtered_treedata[0].data;
                        if (list.length > 1)
                            $('#worldStateInput').focus();

                        $scope.isRefreshingWorldstates = false;
                    }
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
				$scope.filtered_treedata = angular.copy($scope.treedata);
				for (var i = 0; i < $scope.filtered_treedata.length; i++) {
					if ($scope.filtered_treedata[i].children && $scope.filtered_treedata[i].children.length > 0) {
						$scope.filterTree($scope.filtered_treedata[i], $scope.filter_term);
					}
					else {
						if (($scope.filtered_treedata[i].label.toUpperCase()).indexOf($scope.filter_term.toUpperCase()) == -1) {
							$scope.filtered_treedata.remove($scope.filtered_treedata[i]);
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