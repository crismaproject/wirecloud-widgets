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
 * Reads the text file contained by the specified input tag using HTML's new FileReader API.
 * @param {string} fileInputId the DOM identifier of the file input component
 * @param {jQuery.Deferred} deferred a deferred object that will be resolved with the file data once it has been loaded
 */
function getDataFromFile(fileInputId, deferred) {
    var file = document.getElementById(fileInputId).files[0];
    var reader = new FileReader();

    var start = new Date().getTime();
    reader.onload = function () {
        deferred.resolveWith(null, [reader.result]);
        var end = new Date().getTime();
        console.log('Loading data from file took ' + (end - start) + 'ms');
    };
    reader.readAsText(file);
}

function showDispatchNotification() {
    $('div#dispatchNotification')
        .finish()
        .slideDown()
        .delay(2000)
        .slideUp();
}

$(function(){
    $('div#dispatchNotification').hide();

    if (!window.File || !window.FileReader) {
        // browser does not support HTML5 FileReader API!
        var $input = $('input#inputEventDataFile');
        $input.attr('disabled', 'disabled');
        $input.closest('div.panel').hide();
        console.warn('FileReader API not found. File upload will not be available!');
    }
});