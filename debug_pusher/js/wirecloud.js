/*global MashupPlatform*/

/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
var hasMashupPlatform = typeof MashupPlatform !== 'undefined';
if (!hasMashupPlatform)
    console.warn('Wirecloud environment not detected.');

var toConsole = false;
if (hasMashupPlatform) {
    var applyPreferences = function () {
        toConsole = MashupPlatform.prefs.get('to_console');
    };

    MashupPlatform.prefs.registerCallback(applyPreferences);
    applyPreferences();
} else {
    toConsole = true;
}

$(function() {
    /**
     * Gets data from either the textarea or the file input, depending on which one is currently open in the
     * accordion. This method returns a promise as file reader operations are asynchronous.
     * @returns {jQuery.Promise}
     */
    function getData() {
        var deferred = $.Deferred();
        if ($('div.in#manualInputPanel').length)
            deferred.resolveWith(null, [$('#inputEventData').val()]);
        else if($('div.in#fileInputPanel').length)
            getDataFromFile('inputEventDataFile', deferred);
        else
            deferred.reject();
        return deferred.promise();
    }

    /**
     * Reads the text file contained by the specified input tag.
     * @param {string} fileInputId the DOM identifier of the file input component
     * @param {jQuery.Deferred} deferred a deferred object that will be resolved with the file data once it has been loaded
     */
    function getDataFromFile(fileInputId, deferred) {
        var file = document.getElementById(fileInputId).files[0];
        var reader = new FileReader();
        reader.onload = function () {
            deferred.resolveWith(null, [reader.result]);
        };
        reader.readAsText(file);
    }

    if (!window.File || !window.FileReader) {
        // browser does not support HTML5 FileReader API!
        var $input = $('input#inputEventDataFile');
        $input.attr('disabled', 'disabled');
        $input.closest('div.panel').hide();
        console.warn('FileReader API not found. File upload will not be available!');
    }

    $('#btn-send').click(function () {
        getData()
            .done(function (data) {
                if (!data) return;

                if (toConsole) {
                    var remote = null;
                    var reached = hasMashupPlatform ? MashupPlatform.wiring.getReachableEndpoints('data') : [ ];
                    if (reached.length == 1)
                        remote = reached[0].endpoint;
                    else if (reached.length > 1) {
                        remote = [];
                        for (var i = 0; i < reached.length; i++)
                            remote[i] = reached[i].endpoint;
                    }

                    console.log({
                        'sent': true,
                        'local-event': 'data',
                        'remote-event': remote,
                        'data': data
                    });
                }
                if (hasMashupPlatform)
                    MashupPlatform.wiring.pushEvent('data', data);
            })
    });

    if (hasMashupPlatform) {
        $('#btn-refresh-event').click(function () {
            var connections = MashupPlatform.wiring.getReachableEndpoints('data');
            var str = '';
            for (var i = 0; i < connections.length; i++) {
                var connection = connections[i];
                if (i > 0) str += ', ';
                str += connection.endpoint + ' (' + connection.iWidgetName + ')';
            }
            $('#inputEventName').val(str);
        });
    }
});