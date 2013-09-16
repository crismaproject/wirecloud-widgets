/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    table.onSelectionChanged = function (selected) {
        MashupPlatform.wiring.pushEvent('oois_selected_out', JSON.stringify(selected));
    };

    MashupPlatform.wiring.registerCallback('oois_in', function (data) {
        var oois = JSON.parse(data);

        table.clear();
        for (var i = 0; i < oois.length; i++)
            table.addRow(oois[i]);
    });

    MashupPlatform.wiring.registerCallback('oois_selected_in', function (data) {
        var oois = JSON.parse(data);
        table.unselectAll();
        for (var i = 0; i < oois.length; i++)
            table.select(oois[i].entityId);
    });
});