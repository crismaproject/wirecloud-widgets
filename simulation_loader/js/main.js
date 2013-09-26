var ooiWsrApiUri = 'http://localhost/api';

var onSimulationSelected = function () {
    var simulationData = $('select#simulationId option:selected').attr('data-simulation');
    if (!simulationData) return;

    var simulation = JSON.parse(simulationData);
    $('#simulationDescription').text(simulation.description);
    $('#simulationDateTime').text(simulation.startDateTime + 'Z');
};

function loadSimulations() {
    $.get(ooiWsrApiUri + '/Simulation', function (data) {
        var container = $('select#simulationId');
        container.empty();
        for (var i = 0; i < data.length; i++) {
            container.append($('<option></option>')
                .val(data[i].simulationId)
                .text(getTextFor(data[i]))
                .attr('data-simulation', JSON.stringify(data[i])));
        }

        onSimulationSelected();
    }, 'json');
}

function getTextFor(simulation) {
    return simulation.description + ' (' + simulation.simulationId + ')';
}

$(function () {
    $('select#simulationId').change(onSimulationSelected);
    loadSimulations();
});