angular.module('worldStatePickerApp', ['ngResource'])
    .factory('ooiwsr', ['wirecloud', function (wirecloud) {
        var apiUri = wirecloud.getPreference('ooiwsr');
        if (!apiUri) {
            console.warn('No OOI-WSR API URI configured!');
            return null;
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
                    console.warn('Wirecloud not detected. Use injected method window.' + dummyFunctionName + ' (event_data) to trigger it manually.');
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
            }
        }
    })
    .factory('icmm', ['$http', '$resource', 'wirecloud', function ($http, $resource, wirecloud) {
        var icmmUri = wirecloud.getPreference('icmm');
        var icmmWsUri = icmmUri + '/CRISMA.worldstates?level=2&fields=id,ooiRepositorySimulationId,name,description,created,childworldstates,categories,worldstatedata,actualaccessinfo&filter=ooiRepositorySimulationId%3A:simulationId&limit=100';
        return $resource(icmmWsUri, null, {
            query: { method: 'GET', isArray: true, transformResponse: function (data) { return data['$collection']; } }
        });

//        return {
//            listWorldStates: function () {
//                var $promise = new $.Deferred();
//                var $root = this;
//                var icmmUri = wirecloud.getPreference('icmm', 'http://crisma.cismet.de/pilotC/icmm_api');
//                if (icmmUri) {
//                    var getAndAdd = function (path, promise, array, iteration) {
//                        $http
//                            .get(icmmUri + path)
//                            .success(function (pageData) {
//                                promise.notifyWith($root, [iteration, pageData]);
//                                array = array.concat(pageData.$collection);
//
//                                if (pageData.$next)
//                                    getAndAdd(pageData.$next, promise, array, iteration + 1);
//                                else
//                                    promise.resolveWith($root, [array]);
//                            })
//                            .error(function (data, status) {
//                                promise.rejectWith($root, [iteration, status]);
//                            });
//                    };
//
//                    var path = '/CRISMA.worldstates?level=2&fields=id,ooiRepositorySimulationId,name,description,created,childworldstates,categories,worldstatedata,actualaccessinfo&limit=100';
//                    getAndAdd(path, $promise, [], 0);
//                } else {
//                    console.warn('ICMM URI not configured!');
//                    $promise.rejectWith($root);
//                }
//
//                return $promise.promise();
//            }
//        }
    }])
    .controller('WorldStatePickerApp', ['$scope', 'icmm', 'ooiwsr', 'wirecloud', function ($scope, icmm, ooiwsr, wirecloud) {
        $scope.loaded = null;
        $scope.showAll = false;

        // WARNING: simulation data is not reliably set until the ICMM has properly integrated simulation data

        $scope.simulationList = [];
        $scope.selectedSimulation = null;

        $scope.worldStateList = [];
        $scope.selectedWorldState = null;

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
            return $scope.selectedSimulation &&
                worldState.ooiRepositorySimulationId == $scope.selectedSimulation.simulationId &&
                ($scope.showAll || !worldState.hasOwnProperty('childworldstates') || !worldState.childworldstates.length);
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

        $scope.refreshWorldStates = function (simulationId) {
            icmm.query({simulationId: simulationId})
                .$promise.then(function (list) {
                    $scope.worldStateList = list;
                });

//            icmm.listWorldStates()
//                .done(function (worldStates) {
//                    $scope.worldStateList = worldStates;
//                });

            /*            return $.when(icmm.listWorldStates(), ooiwsr.listWorldStates())
             .done(function (icmmWorldStates, ooiwsrWorldStates) {
             *//*
             NOTE: this code block is a very quirky work-around due to current limitations of the ICMM
             model. These limitations are currently being discussed, so this is very likely to change.
             *//*

             var ooiWsLookup = ooiwsrWorldStates[0].toDict('worldStateId');
             var ws = [];
             for (var i = 0; i < icmmWorldStates.length; i++) {
             var icmmWorldState = icmmWorldStates[i];
             var worldStateData = icmmWorldState.worldstatedata
             .filter(function (x) {
             if (!x.hasOwnProperty('actualaccessinfo')) return false;
             var ooiwsrWorldStateAccess = JSON.parse(x.actualaccessinfo.replace(/'/g, '"'));
             return ooiwsrWorldStateAccess.resource == 'WorldState';
             });
             if (!worldStateData.length) continue;
             else if(worldStateData.length > 1) console.warn('ICMM WS ' + icmmWorldState['$self'] + ' has ambigous OOI-WSR WorldState refs.');

             var ooiwsrId = JSON.parse(worldStateData[0].actualaccessinfo.replace(/'/g, '"')).id;
             if (!ooiWsLookup.hasOwnProperty(ooiwsrId)) continue;

             var ooiwsrWorldState = ooiWsLookup[ooiwsrId];
             ws.push({
             icmm: icmmWorldState,
             ooiwsr: ooiwsrWorldState
             });
             }

             $scope.worldStateList = ws;
             });*/
        };

        $scope.refreshSimulations = function () {
            return ooiwsr.listSimulations()
                .done(function (sims) {
                    $scope.simulationList = sims;
                });
        };

        $scope.loadWorldState = function () {
            var progressCurrent = 0, progressMax = 4;
            var $progressBar = $('#progressBar');
            var $progressBarContainer = $('#progressBarContainer');

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

            wirecloud.send('simulation', $scope.selectedSimulation);
            advanceProgress();

            wirecloud.send('worldstate', $scope.selectedWorldState.ooiwsr);
            advanceProgress();

            ooiwsr.fetch('/Entity?wsid=' + $scope.selectedWorldState.ooiwsr.worldStateId)
                .done(function (oois) {
                    wirecloud.send('oois', oois);
                    advanceProgress();
                })
                .fail(function () {
                    $scope.loaded = null;
                });

            ooiwsr.listEntityTypes()
                .done(function (ooiTypes) {
                    wirecloud.send('ooi_types', ooiTypes);
                    advanceProgress();
                })
                .fail(function () {
                    $scope.loaded = null;
                });
        };

        $scope.refreshSimulations();
        $scope.refreshWorldStates();

        wirecloud.on('load_worldstate', function (newWorldState) {
            if (!newWorldState.hasOwnProperty('ooiwsr') || !newWorldState.hasOwnProperty('icmm'))
                throw 'Cannot load with incomplete worldstate data (yet).'; // TODO: newWorldState will likely be an OOIWSR instance. Needs looking up in the ICMM to find out the ICMM instance.
            $scope.selectedWorldState = newWorldState;
            ooiwsr.fetch('/Entity?wsid=' + newWorldState.ooiwsr.worldStateId)
                .done(function (oois) {
                    wirecloud.send('oois', oois);
                })
                .fail(function () {
                    $scope.loaded = null;
                });
        });
    }]);

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