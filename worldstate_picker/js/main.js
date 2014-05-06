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
            }
        }
    })
    .factory('icmm', ['$http', '$resource', 'wirecloud', function ($http, $resource, wirecloud) {
        var icmmUri = wirecloud.getPreference('icmm');
        var icmmWsUri = icmmUri + '/CRISMA.worldstates?filter=ooiRepositorySimulationId%3A:simulationId';
        return $resource(icmmWsUri, { simulationId: '@id' }, {
            query: {
                method: 'GET',
                isArray: true,
                params: {
                    level: 2,
                    fields: 'id,ooiRepositorySimulationId,name,description,created,childworldstates,categories,worldstatedata,actualaccessinfo',
                    deduplicate: true,
                    limit: 500
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
        $scope.showAll = false;
        $scope.isRefreshingSimulations = false;
        $scope.isRefreshingWorldstates = false;

        // NOTE: simulation data is not reliably set until the ICMM has properly integrated simulation data

        $scope.simulationList = [];
        $scope.selectedSimulation = null;

        $scope.worldStateList = [];
        $scope.selectedWorldState = null;

        $scope.ooiTypes = null;

        $scope.prettySimulation = function (simulation) {
            return simulation.description + ' (' + simulation.simulationId + ')';
        };
        $scope.prettyWorldState = function (worldState) {
            var meta = [];
            if (worldState.created) meta.push(new Date(worldState.created).toLocaleString());
            if (worldState.description) meta.push(worldState.description);

            return meta.length ?
                worldState.name + ' (' + meta.join('; ') + ')' :
                worldState.name;
        };
        $scope.showWorldState = function (worldState) {
            return $scope.showAll || !worldState.hasOwnProperty('childworldstates') || !worldState.childworldstates.length;
        };
        $scope.timeDifference = function (a, b) {
            return a && b ? new Date(a).difference(new Date(b)) : null;
        };

        $scope.reset = function () {
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

        $scope.refreshWorldStates = function (simulationId, autoload) {
            $scope.isRefreshingWorldstates = true;
            icmm.query({simulationId: simulationId})
                .$promise.then(function (list) {
                    $scope.worldStateList = list;
                    if (list.length) {
                        $scope.selectedWorldState = $scope.worldStateList[list.length - 1];
                        if (list.length > 1)
                            $('#worldStateInput').focus();

                        if (autoload)
                            $scope.loadWorldState();

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