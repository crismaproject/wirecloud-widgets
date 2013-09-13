/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    table.onSelected = function (row) {
        var selection = [];
        $('#ooi-table tr.selected').each(function (index, value) {
            var ooi = JSON.parse($(value).attr('data-orig'));
            selection.push(ooi);
        });
        MashupPlatform.wiring.pushEvent('oois_selected_out', JSON.stringify(selection));
    };

    MashupPlatform.wiring.registerCallback('oois_in', function (data) {
        var oois = JSON.parse(data);

        table.clear();
        for (var i = 0; i < oois.length; i++) {
            var ooi = oois[i];
            table.addRow({
                id: ooi.id,
                type: ooi.type,
                site: ooi.site
            }, ooi);
        }
    });

    MashupPlatform.wiring.registerCallback('oois_selected_in', function (data) {
        var oois = JSON.parse(data);
        table.unselectAll();
        for (var i = 0; i < oois.length; i++)
            table.select(oois[i].id);
    });
});