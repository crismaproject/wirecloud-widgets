/*global groupManager,MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
if (typeof MashupPlatform !== 'undefined') {
    var applyPreferences = function () {
        var restrictedTo = MashupPlatform.prefs.get('only_show');
        if (restrictedTo) {
            var array = [ ];
            try {
                var elements = restrictedTo.split(',');
                for (var i = 0; i < elements.length; i++) {
                    var value = parseInt(elements[i]);
                    if (isNaN(value)) throw 'Invalid "only_show" element: ' + elements[i];
                    array.push(value);
                }
                groupManager.showOnly = array;
            } catch (e) {
                console.log('Could not parse the "only_show" preference. A list of numbers separated by the comma ' +
                    'character (,) was expected, but instead this was received: "' + restrictedTo + '"');
                throw 'Invalid value for "only_show"';
            }
        }

        storeGroups = MashupPlatform.prefs.get('enable_group_storage');
    };
    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();

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