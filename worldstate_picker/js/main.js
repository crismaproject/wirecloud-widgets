angular.module('worldStatePickerApp', [])
    .factory('ooiwsr', ['wirecloud', function (wirecloud) {
        var apiUri = wirecloud.getPreference('ooiwsr');
        if (!apiUri) {
            console.warn('No OOI-WSR API URI configured!');
            return null;
        } else return new WorldStateRepository(apiUri);
    }]).factory('wirecloud', function () {
        return {
            getPreference: function (name, fallback) {
                return typeof MashupPlatform !== 'undefined' ? MashupPlatform.prefs.get(name) : fallback;
            },

            on: function(event, callback) {
                if (typeof MashupPlatform !== 'undefined')
                    MashupPlatform.wiring.registerCallback(event, callback);
                else if (!this.hasOwnProperty('$warned' + event)) {
                    this['$warned' + event] = true;
                    var dummyFunctionName = 'wcTriggerEv_' + event;
                    console.warn('Wirecloud not detected. Use injected method window.' + dummyFunctionName + ' (event_data) to trigger it manually.');
                    window[dummyFunctionName] = callback;
                }
            },

            send: function(wiringName, data) {
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
    .factory('icmm', ['$http', 'wirecloud', function ($http, wirecloud) {
        return {
            listWorldStates: function () {
                var $promise = new $.Deferred();
                var icmmUri = wirecloud.getPreference('icmm');
                if (icmmUri) {
                    var $root = this;
                    var getAndAdd = function (path, promise, array, iteration) {
                        $http
                            .get(icmmUri + path)
                            .success(function (pageData) {
                                promise.notifyWith($root, [iteration, pageData]);
                                array = array.concat(pageData.$collection);

                                if (pageData.$next)
                                    getAndAdd(pageData.$next, promise, array, iteration + 1);
                                else
                                    promise.resolveWith($root, [array]);
                            })
                            .error(function (data, status) {
                                promise.rejectWith($root, [iteration, status]);
                            });
                    };

                    var path = '/CRISMA.worldstates?level=2&fields=id,name,description,created,childworldstates,worldstatedata,actualaccessinfo&limit=100';
                    getAndAdd(path, $promise, [], 0);
                } else {
                    console.warn('ICMM URI not configured!');
                    $promise.rejectWith($root);
                }

                return $promise.promise();
            }
        }
    }])
    .controller('WorldStatePickerApp', ['$scope', 'icmm', 'ooiwsr', 'wirecloud', function ($scope, icmm, ooiwsr, wirecloud) {
        $scope.loaded = null;
        $scope.showAll = false;

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
            return $scope.showAll || !worldState.hasOwnProperty('childworldstates') || !worldState.childworldstates.length;
        };
        $scope.timeDifference = function (a, b) {
            return a && b ? new Date(a).difference(new Date(b)) : null;
        };

        $scope.reset = function () {
            $scope.loaded = null;
            $scope.refreshSimulations();
            $scope.refreshWorldStates();
            // TODO: angular forgets previous selections for selectedWorldState and selectedSimulation after the model changes
        };

        $scope.refreshWorldStates = function () {
            icmm.listWorldStates()
                .done(function (ws) {
                    for (var i = 0; i < ws.length; i++)
                        if (ws[i].description.charAt(0) == '<') // FIXME: evil HTML recognition hack
                            ws[i].description = $(ws[i].description).text();
                    $scope.worldStateList = ws;
                });
        };

        $scope.refreshSimulations = function () {
            ooiwsr.listSimulations()
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

            var icmmWorldStateId = $scope.selectedWorldState.id;
            var ooiwsrWorldStateAccess = JSON.parse($scope.selectedWorldState.worldstatedata[0].actualaccessinfo.replace(/'/g, '"'));
            var ooiwsrWorldStateId = ooiwsrWorldStateAccess.id;
            ooiwsr.getWorldState(ooiwsrWorldStateId)
                .done(function (worldState) {
                    worldState['$icmmWorldStateId'] = icmmWorldStateId;
                    wirecloud.send('worldState', worldState);
                    advanceProgress();
                })
                .fail(function () {
                    loaded = null;
                });
            ooiwsr.listEntityTypes()
                .done(function (ooiTypes) {
                    wirecloud.send('ooi_types', ooiTypes);
                    advanceProgress();
                })
                .fail(function () {
                    loaded = null;
                });
            ooiwsr.fetch('/Entity?wsid=' + ooiwsrWorldStateId)
                .done(function (oois) {
                    wirecloud.send('oois', oois);
                    advanceProgress();
                })
                .fail(function () {
                    loaded = null;
                });
        };

        $scope.refreshSimulations();
        $scope.refreshWorldStates();

        wirecloud.on('load_worldstate', function(newWorldState) {
            console.log(newWorldState); // TODO
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