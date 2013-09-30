/*global groupManager,MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    var propagate = true;

    $(document).on('selectionChanged', function () { console.log('selection changed'); });

    if (typeof MashupPlatform !== 'undefined') {
        $(document).on('selectionChanged', function () {
            MashupPlatform.wiring.pushEvent('oois_selected_out', JSON.stringify(selected));
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
});