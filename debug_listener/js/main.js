/**
 * Adds a line to the top of the event log.
 * @param {object} data the contents of the line to add; it will always be converted to a string.
 */
function appendData(data) {
    $('#data').prepend($('<li></li>').text(data.toString()));
}