/*global groupManager,MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
if (typeof MashupPlatform !== 'undefined') {
    $(function () {
        $(document).on('selectionChanged', function () {
            MashupPlatform.wiring.pushEvent('oois_selected_out', JSON.stringify(groupManager.getSelected()));
        });
    });

    MashupPlatform.wiring.registerCallback('oois_in', function (data) {
        groupManager.setOOIs(JSON.parse(data));
    });

    MashupPlatform.wiring.registerCallback('oois_selected_in', function (data) {
        groupManager.setSelected(JSON.parse(data));
    });

    MashupPlatform.wiring.registerCallback('types', function (data) {
        groupManager.setOOITypes(JSON.parse(data));
    });
}