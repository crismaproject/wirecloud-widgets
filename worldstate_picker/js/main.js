angular.module('worldStatePickerApp', [])
    .factory('ooiwsr', function() {
        var ooiwsr = new WorldStateRepository('');
        if (typeof MashupPlatform !== 'undefined') {
            var applyPreferences = function () { ooiwsr.apiUri = MashupPlatform.prefs.get('api'); };
            MashupPlatform.prefs.registerCallback(applyPreferences);
            applyPreferences();
        }
        return ooiwsr;
    })
    .controller('WorldStatePickerApp', ['$scope', 'ooiwsr', function($scope, ooiwsr) {
        $scope.busy = false;
        $scope.loaded = null;

        $scope.simulationList = [];
        $scope.selectedSimulation = null;

        $scope.worldStateList = [];
        $scope.selectedWorldState = null;

        $scope.prettySimulation = function(simulation) {
            return simulation.description + ' (' + simulation.simulationId + ')';
        };
        $scope.prettyWorldState = function(worldState) {
            var meta = [];
            if (worldState.dateTime) meta.push(new Date(worldState.dateTime).toLocaleString());
            if (worldState.description) meta.push(worldState.description);

            return meta.length ?
                worldState.worldStateId + ' (' + meta.join('; ') + ')' :
                worldState.worldStateId;
        };

        $scope.refreshWorldStates = function() {
            $scope.busy = true;

            ooiwsr.listWorldStates()
                .done(function(ws){
                    var i;
                    var array = [];
                    for(i = 0; i < ws.length; i++)
                        array[ws[i].worldStateId] = $.extend({children: [], isLeaf: true}, ws[i]);
                    for(i=0;i<array.length;i++){
                        if(!array[i]) continue;
                        var $me = array[i];
                        if($me.worldStateParentId) {
                            array[$me.worldStateParentId].children.push($me);
                            array[$me.worldStateParentId].isLeaf = false;
                        }
                    }

                    $scope.worldStateList = array;
                })
                .always(function() {
                    $scope.busy = false;
                    $scope.$apply();
                });
        };

        $scope.refreshSimulations = function() {
            $scope.busy = true;

            ooiwsr.listSimulations()
                .done(function(sims){
                    $scope.simulationList = sims;
                })
                .always(function() {
                    $scope.busy = false;
                    $scope.$apply();
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
            send('simulation', $scope.selectedSimulation); advanceProgress();
            send('worldState', $scope.selectedWorldState); advanceProgress();
            $scope.loaded = $scope.selectedWorldState;
            ooiwsr.listEntityTypes()
                .done(function(ooiTypes) { send('ooi-types', ooiTypes); advanceProgress(); });
            ooiwsr.fetch('/Entity?wsid=' + $scope.selectedWorldState.worldStateId)
                .done(function(oois) { send('oois', oois); advanceProgress(); });
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