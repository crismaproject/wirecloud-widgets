/*
 * Iff the Wirecloud environment is available, register endpoints.
 */
$(function () {
    if (typeof MashupPlatform === 'undefined') {
        console.warn('Wirecloud environment not detected.');
    } else {
        MashupPlatform.wiring.registerCallback('data', function (data) {
            appendData(data);
        });
    }
});