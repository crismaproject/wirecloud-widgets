/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else if (typeof table === 'undefined') {
        console.warn('"table" variable is not defined.')
    } else {
        var applyPreferences = function () {
            var caption = MashupPlatform.prefs.get('caption');
            if (caption.length > 0) table.setCaption(caption);
        };

        MashupPlatform.prefs.registerCallback(applyPreferences);
        applyPreferences();

        $('#table_container').bind('selected_row', function (ev) {
            var selectedRowIndex = $(ev.target).attr('data-n');
            if (selectedRowIndex) {
                var row = table.rows[selectedRowIndex];
                var data = {};
                for (var i = 0; i < table.headers.length; i++)
                    data[table.headers[i]] = row[i];

                MashupPlatform.wiring.pushEvent('selected_row', data);
            }
        });
    }
});