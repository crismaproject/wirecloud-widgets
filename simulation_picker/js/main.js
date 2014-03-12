var api = new WorldStateRepository('http://crisma-ooi.ait.ac.at/api');

var onSimulationSelected = function () {
    var simulation = $('select#simulationId option:selected');
    $('#simulationDescription').text(simulation.attr('data-sim-descr'));
    $('#simulationDateTime').text(simulation.attr('data-sim-time') + 'Z');
};

/**
 * Asynchronously retrieves a list of simulations from the OOI-WSR.
 * When the request completed, the list of simulations will be replaced in the DOM
 */
function loadSimulations() {
    $('button,input,select').attr('disabled', 'disabled');
    api.listSimulations()
        .done(function (data) {
            var container = $('select#simulationId');
            var previouslySelected = $(container).val();
            container.empty();
            for (var i = 0; i < data.length; i++) {
                container.append($('<option></option>')
                    .val(data[i].simulationId)
                    .text(getTextFor(data[i]))
                    .attr('data-sim-descr', data[i].description)
                    .attr('data-sim-time', data[i].startDateTime)
                );
            }

            if (previouslySelected)
                container.val(previouslySelected);

            onSimulationSelected();
        }).always(function () {
            $('button[disabled],input[disabled],select[disabled]').removeAttr('disabled');
        });
}

/**
 * @param {object} simulation the simulation to create a human-friendly displayable string for
 * @param {number} simulation.simulationId the simulation's internal identifier
 * @param {string} simulation.description a description for the simulation
 * @param {string?} simulation.startDateTime the simulation's start time, following the ISO 8601 pattern
 * @param {string?} simulation.endDateTime the simulation's end time, following the ISO 8601 pattern
 * @param {boolean?} simulation.isTemplate if true, the simulation is considered a template
 * @returns {string} a human-friendly displayable string
 */
function getTextFor(simulation) {
    return simulation.description + ' (' + simulation.simulationId + ')';
}

$(function () {
    $('select#simulationId').change(onSimulationSelected);
    $('button#btn-refresh').click(loadSimulations);

    loadSimulations();
});