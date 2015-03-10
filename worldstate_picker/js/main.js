angular.module('worldStatePickerApp', ['ngResource'])
    .factory('ooiwsr', ['wirecloud', function (wirecloud) {
        var apiUri = wirecloud.getPreference('ooiwsr');
        if (!apiUri) {
            throw 'No OOI-WSR API URI configured!';
        } else return new WorldStateRepository(apiUri);
    }])
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
                    window[dummyFunctionName] = function(arg) {
                        callback(typeof arg === 'string' ? arg : JSON.stringify(arg));
                    };
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
        var icmmWsUri = icmmUri + '/CRISMA.worldstates/:worldStateId';
        return $resource(icmmWsUri, { 'worldStateId': '@id' }, {
            get: {
                params: {
                    level: 2,
                    fields: 'id,ooiRepositorySimulationId,name,description,created,simulatedTime,childworldstates,categories,worldstatedata,actualaccessinfo',
                    deduplicate: true
                }
            },
            query: {
                method: 'GET',
                isArray: true,
                params: {
                    level: 2,
                    fields: 'id,ooiRepositorySimulationId,name,description,created,simulatedTime,childworldstates,categories,worldstatedata,actualaccessinfo',
                    deduplicate: true,
                    limit: 1000000
                },
                transformResponse: function (data) {
                    var col = JSON.parse(data).$collection;
                    var res = [];

                    for (var i = 0; i < col.length; ++i)
                        res.push(col[i]);

                    return res;
                }
            }
        });
    }])
    .controller('WorldStatePickerApp', ['$scope', 'icmm', 'ooiwsr', 'wirecloud', function ($scope, icmm, ooiwsr, wirecloud) {
        $scope.loaded = null;
        $scope.showAll = true;
        $scope.isRefreshingSimulations = false;
        $scope.isRefreshingWorldstates = false;
        $scope.lastInterval = null;
        try {
            $scope.pollInterval = parseInt(wirecloud.getPreference('polling', 0)) * 1000;
        } catch(e) {
            $scope.pollInterval = 0;
        }

        $scope.simulationList = [];
        $scope.selectedSimulation = null;

        $scope.worldStateList = [];
        $scope.selectedWorldState = null;

        $scope.ooiTypes = null;

        $scope.prettySimulation = function (simulation) {
            return noHtml(simulation.description || 'Simulation') + ' (' + simulation.simulationId + ')';
        };
        $scope.prettyWorldState = function (worldState) {
            var meta = [];
            if (worldState.simulatedTime) meta.push(new Date(worldState.simulatedTime).toLocaleString());
            if (worldState.description) meta.push(noHtml(worldState.description));

            return meta.length ? worldState.name + ' (' + meta.join('; ') + ')' : worldState.name;
        };
        $scope.showWorldState = function (worldState) {
            return $scope.showAll || !worldState.hasOwnProperty('childworldstates') || !worldState.childworldstates.length;
        };
        $scope.timeDifference = function (a, b) {
            return a && b ? new Date(a).difference(new Date(b)) : null;
        };

        $scope.reset = function () {
            if ($scope.lastInterval != null) {
                clearInterval($scope.lastInterval);
                $scope.lastInterval = null;
            }
            var originalSimulation = $scope.selectedSimulation;
            var originalWorldState = $scope.selectedWorldState;

            $scope.loaded = null;
            $.when($scope.refreshSimulations(), $scope.refreshWorldStates())
                .done(function () {
                    if (originalSimulation != null)
                        $scope.selectedSimulation = originalSimulation;
                    if (originalWorldState != null)
                        $scope.selectedWorldState = originalWorldState;
                });
        };

        function worldStateLoaded() {
            if ($scope.lastInterval != null) {
                clearInterval($scope.lastInterval);
                $scope.lastInterval = null;
            }
            if ($scope.pollInterval <= 0) return;

            var simulationId = $scope.selectedSimulation.simulationId;
            var observedChildren = { };
            for (var i = 0; i < $scope.loaded.childworldstates.length; i++)
                observedChildren[$scope.loaded.childworldstates[i].id] = true;

            $scope.lastInterval = window.setInterval(function () {
                icmm.get({worldStateId: $scope.loaded.id}, function(worldState) {
                    var newChildren = worldState.childworldstates.filter(function (x) {
                        return !observedChildren.hasOwnProperty(x.id);
                    });

                    if (newChildren.length != 0) {
                        clearInterval($scope.lastInterval);
                        $scope.lastInterval = null;

                        var loadThisOne = newChildren[newChildren.length - 1].id;
                        $scope.refreshWorldStates(simulationId, function (list) {
                            for (var i = 0; i < list.length; i++)
                                if (list[i].id == loadThisOne) return list[i];
                            return null;
                        });
                    }
                });
            }, $scope.pollInterval);
        }

        $scope.refreshWorldStates = function (simulationId, autoload) {
            $scope.isRefreshingWorldstates = true;
            icmm.query({filter: 'ooiRepositorySimulationId:' + simulationId})
                .$promise.then(function (list) {
                    $scope.worldStateList = list;
                    if (list.length) {
                        $scope.selectedWorldState = $scope.worldStateList[list.length - 1];
                        if (list.length > 1)
                            $('#worldStateInput').focus();

                        if (typeof (autoload) === 'boolean' && autoload === true)
                            $scope.loadWorldState();
                        else if (typeof (autoload) === 'function') {
                            var loadThis = autoload(list);
                            if (loadThis) {
                                $scope.selectedWorldState = loadThis;
                                $scope.loadWorldState();
                            }
                        }

                        $scope.isRefreshingWorldstates = false;
                    }
                });
        };

        $scope.refreshSimulations = function () {
            $scope.isRefreshingSimulations = true;
            return ooiwsr
                .listSimulations()
                .done(function (sims) {
                    $scope.simulationList = sims;
                    $scope.isRefreshingSimulations = false;
                    $scope.$apply();
                });
        };

        $scope.loadWorldState = function () {
            var progressCurrent = 0, progressMax = 4;
            var $progressBar = $('#progressBar');
            var $progressBarContainer = $('#progressBarContainer');

            $progressBar.css({width: 0});

            var advanceProgress = function () {
                progressCurrent++;
                var options = { };
                if (progressCurrent >= progressMax) {
                    options.done = function () {
                        $progressBarContainer.modal('hide');
                        $('#loadedContainer').modal('show');
                    };
                    $progressBar.addClass('progress-bar-success');

                    worldStateLoaded();
                }
                var progress = { width: (progressCurrent / progressMax) * 100 + '%' };

                $progressBar.animate(progress, options);
            };

            $progressBarContainer.modal('show');
            $progressBar.removeClass('progress-bar-success');
            $scope.loaded = $scope.selectedWorldState;

            var simulation = $.extend({
                selectedWorldState: $scope.selectedWorldState,
                worldStates: $scope.worldStateList
            }, $scope.selectedSimulation);

            wirecloud.send('simulation', simulation);
            advanceProgress();

            var ooiwsrWorldStateId = getOOIWSRWorldStateIdForICMMWorldState($scope.selectedWorldState);
            ooiwsr.getWorldState(ooiwsrWorldStateId)
                .done(function (worldState) {
                    worldState['$icmm'] = $scope.selectedWorldState;
                    wirecloud.send('worldstate', worldState);
                    advanceProgress();
                })
                .fail(function () {
                    $scope.loaded = null;
                });

            ooiwsr.fetch('/Entity?wsid=' + ooiwsrWorldStateId)
                .done(function (oois) {
                    wirecloud.send('oois', oois);
                    advanceProgress();
                })
                .fail(function () {
                    $scope.loaded = null;
                });

            var entityTypes = $scope.ooiTypes;
            if (entityTypes) {
                wirecloud.send('ooi_types', entityTypes);
                advanceProgress();
            } else
                ooiwsr.listEntityTypes()
                    .done(function (ooiTypes) {
                        $scope.ooiTypes = ooiTypes;
                        wirecloud.send('ooi_types', ooiTypes);
                        advanceProgress();
                    })
                    .fail(function () {
                        $scope.loaded = null;
                    });
        };

        $scope.refreshSimulations();

        wirecloud.on('load_simulation', function (simulation) {
            var setSimulation = function (simulationData) {
                $scope.simulationList = [ simulationData ];
                $scope.selectedSimulation = simulationData;
                $scope.refreshWorldStates(simulationData.simulationId, true);
            };

            try { simulation = JSON.parse(simulation); } catch (e) { }

            if (typeof simulation === 'number')
                ooiwsr.getSimulation(simulation).done(setSimulation);
            else if(typeof simulation === 'object' && simulation.hasOwnProperty('simulationId'))
                setSimulation(simulation);
            else
                console.warn('Not sure what to do with the specified object received over the load_simulation endpoint.');
        });

        wirecloud.on('load_worldstate', function (icmmWorldState) {
            if (typeof(icmmWorldState) === 'string')
                icmmWorldState = JSON.parse(icmmWorldState);

            var ooiwsrWorldStateId = getOOIWSRWorldStateIdForICMMWorldState(icmmWorldState);
            ooiwsr.getWorldState(ooiwsrWorldStateId)
                .done(function (worldState) {
                    worldState['$icmm'] = icmmWorldState;
                    wirecloud.send('worldstate', worldState);
                })
                .fail(function () {
                    $scope.loaded = null;
                });

            ooiwsr.fetch('/Entity?wsid=' + ooiwsrWorldStateId)
                .done(function (oois) {
                    wirecloud.send('oois', oois);
                })
                .fail(function () {
                    $scope.loaded = null;
                });

            var entityTypes = $scope.ooiTypes;
            if (entityTypes)
                wirecloud.send('ooi_types', entityTypes);
            else
                ooiwsr.listEntityTypes()
                    .done(function (ooiTypes) {
                        $scope.ooiTypes = ooiTypes;
                        wirecloud.send('ooi_types', ooiTypes);
                    })
                    .fail(function () {
                        $scope.loaded = null;
                    });
        });
    }]);

function getOOIWSRWorldStateIdForICMMWorldState(icmmWorldState) {
    var ooiwsrWorldStateAccess = JSON.parse(icmmWorldState.worldstatedata[0].actualaccessinfo.replace(/'/g, '"'));
    return ooiwsrWorldStateAccess.id;
}

// This is a VERY rudimentary check to see if we're handling a string beginning with <html>. If so, strip everything
// but the text bits.
function noHtml(str) {
    return str.substr(0, 6) == '<html>' ? $(str).text() : str;
}

String.prototype.pluralize = function (n) {
    if (n == 1) return 'one ' + this;
    else return n + ' ' + this + 's';
};

Date.prototype.difference = function (other) {
    if (!(other instanceof Date)) other = new Date(other);
    var diff = Math.round(Math.abs(this - other) / 1000);

    var components = [ ];
    var subTimeUnit = function (unit, inSeconds) {
        if (diff >= inSeconds) {
            var units = Math.floor(diff / inSeconds);
            diff -= units * inSeconds;
            components.push(unit.pluralize(units));
        }
    };
    subTimeUnit('week', 604800);
    subTimeUnit('day', 86400);
    subTimeUnit('hour', 3600);
    subTimeUnit('minute', 60);
    subTimeUnit('second', 1);

    return components.join(', ');
};

Array.prototype.any = function (predicate) {
    for (var i = 0; i < this.length; i++)
        if (predicate(this[i])) return true;
    return false;
};

/**
 * Groups the provided array of objects into an object where the object's properties are values extracted
 * from the keyProperty property of array elements, and each keyed entry in the object is the first
 * element of the original array sharing the same key.
 *
 * @param {string} keyProperty
 * @returns {{}}
 */
Array.prototype.toDict = function(keyProperty) {
    var groups = { };

    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (!obj.hasOwnProperty(keyProperty)) continue;
        var key = obj[keyProperty];
        if (!(key in groups))
            groups[key] = obj;
    }

    return groups;
};