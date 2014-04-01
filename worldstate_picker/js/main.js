angular.module('worldStatePickerApp', [])
    .factory('ooiwsr', ['wirecloud', function(wirecloud) {
        var apiUri = wirecloud.getPreference('ooiwsr');
        if (!apiUri) {
            console.warn('No OOI-WSR API URI configured!');
            return null;
        } else return new WorldStateRepository(apiUri);
    }])
    .factory('wirecloud', function() {
        return {
            getPreference: function(name, fallback) {
                return typeof MashupPlatform !== 'undefined' ? MashupPlatform.prefs.get(name) : fallback;
            }
        }
    })
    .factory('icmm', ['$http', 'wirecloud', function($http, wirecloud) {
        return {
            listWorldStates: function() {
                var $promise = new $.Deferred();
                var icmmUri = wirecloud.getPreference('icmm');
                if (icmmUri) {
                    var $root = this;
                    var getAndAdd = function(path, promise, array, iteration) {
                        $http
                            .get(icmmUri + path)
                            .success(function(pageData){
                                promise.notifyWith($root, [iteration, pageData]);
                                array = array.concat(pageData.$collection);

                                if (pageData.$next)
                                    getAndAdd(pageData.$next, promise, array, iteration + 1);
                                else
                                    promise.resolveWith($root, [array]);
                            })
                            .error(function(data, status) {
                                promise.rejectWith($root, [iteration, status]);
                            });
                    };

                    var path = '/CRISMA.worldstates?level=1&fields=id,name,description,created,childworldstates,actualaccessinfo&limit=100';
                    getAndAdd(path, $promise, [], 0);
                } else {
                    console.warn('ICMM URI not configured!');
                    $promise.rejectWith($root);
                }

                return $promise.promise();
            }
        }
    }])
    .controller('WorldStatePickerApp', ['$scope', 'icmm', 'ooiwsr', function($scope, icmm, ooiwsr) {
        $scope.loaded = null;
        $scope.showAll = false;

        $scope.simulationList = [];
        $scope.selectedSimulation = null;

        $scope.worldStateList = [];
        $scope.selectedWorldState = null;

        $scope.prettySimulation = function(simulation) {
            return simulation.description + ' (' + simulation.simulationId + ')';
        };
        $scope.prettyWorldState = function(worldState) {
            var meta = [];
            if (worldState.created) meta.push(new Date(worldState.created).toLocaleString());
            if (worldState.description) meta.push(worldState.description);

            return meta.length ?
                worldState.name + ' (' + meta.join('; ') + ')' :
                worldState.name;
        };
        $scope.showWorldState = function(worldState) {
            return $scope.showAll || !worldState.hasOwnProperty('childworldstates') || !worldState.childworldstates.length;
        };
        $scope.timeDifference = function(a, b) {
            return a && b ? new Date(a).difference(new Date(b)) : null;
        };

        $scope.refreshWorldStates = function() {
            icmm.listWorldStates()
                .done(function(ws){
                    $scope.worldStateList = ws;
                });
        };

        $scope.refreshSimulations = function() {
            ooiwsr.listSimulations()
                .done(function(sims){
                    $scope.simulationList = sims;
                });
        };

        $scope.loadWorldState = function() {
            var progressCurrent = 0, progressMax = 4;
            var $progressBar = $('#progressBar');
            var $progressBarContainer = $('#progressBarContainer');

            var advanceProgress = function() {
                progressCurrent++;
                var options = { };
                if (progressCurrent >= progressMax) {
                    options.done = function() {
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

            send('simulation', $scope.selectedSimulation); advanceProgress();
            ooiwsr.getWorldState($scope.selectedWorldState.id)
                .done(function(worldState) { send('worldState', worldState); advanceProgress(); })
                .fail(function() { loaded = null; });
            ooiwsr.listEntityTypes()
                .done(function(ooiTypes) { send('ooi-types', ooiTypes); advanceProgress(); })
                .fail(function() { loaded = null; });
            ooiwsr.fetch('/Entity?wsid=' + $scope.selectedWorldState.id)
                .done(function(oois) { send('oois', oois); advanceProgress(); })
                .fail(function() { loaded = null; });
        };

        $scope.refreshSimulations();
        $scope.refreshWorldStates();
    }]);

function send(wiringName, data) {
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

String.prototype.pluralize = function(n) {
    if (n == 1) return 'one ' + this;
    else return n + ' ' + this + 's';
};

Date.prototype.difference = function(other) {
    if (!(other instanceof Date)) other = new Date(other);
    var diff = Math.round(Math.abs(this - other)/1000);

    var components = [ ];
    var subTimeUnit = function(unit, inSeconds) {
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