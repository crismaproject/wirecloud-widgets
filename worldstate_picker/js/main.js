window.ooi_wsr_uri = 'http://localhost/api';

$(function () {
    $('#btn-next').attr('disabled', 'disabled');
    $('#btn-prev').attr('disabled', 'disabled');

    $('#btn-next').click(function () {
        $('option:selected', 'select#worldstateId').removeAttr('selected').next('option').attr('selected', 'selected');
        $('#btn-load').click();
    });
    $('#btn-prev').click(function () {
        $('option:selected', 'select#worldstateId').removeAttr('selected').prev('option').attr('selected', 'selected');
        $('#btn-load').click();
    });

    $('#btn-load').click(function() {
        var wsId = $('#worldstateId').val();
        $(this).attr('data-current-wsid', wsId);

        enabledIff('#btn-next', $('#worldstateId :selected').nextAll().length);
        enabledIff('#btn-prev', $('#worldstateId :selected').prevAll().length);
    });

    updateSimulations();
    $('#simulationId').change(function() {
        updateWorldstates();
    });
});

function updateSimulations() {
    var async = updateAsync('#simulationId', window.ooi_wsr_uri + '/Simulation',
        function (data) { return data.simulationId; },
        function (data) { return data.description; });

    async.done(function () {
        if ($('#simulationId').val())
            updateWorldstates();
    });
}

function updateWorldstates() {
    var simulationId = $('#simulationId').val();
    updateAsync('#worldstateId', window.ooi_wsr_uri + '/WorldState',
        function (data) { return data.worldStateId; },
        function (data) { return data.worldStateId; },
        function (data) { return data.simulation.simulationId == simulationId });
}

function enabledIff(what, predicate) {
    if (predicate) $(what).removeAttr('disabled');
    else $(what).attr('disabled', 'disabled');
}

/**
 * @param {string} container
 * @param {string} srcUri
 * @param {function(object)} valueOf
 * @param {function(object)} textOf
 * @param {function(object)?} predicate
 */
function updateAsync(container, srcUri, valueOf, textOf, predicate) {
    $(container).attr('disabled', 'disabled');
    return $.get(srcUri, function (data) {
        $(container).empty();

        for (var i = 0; i < data.length; i++) {
            if (predicate && !predicate(data[i])) continue;
            $(container).append(
                $('<option></option>')
                    .attr('value', valueOf(data[i]))
                    .text(textOf(data[i]))
            );
        }

        $(container).removeAttr('disabled');
    }, 'json');
}