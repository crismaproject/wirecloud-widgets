var rowLimit = 100;

/**
 * Adds a line to the top of the event log.
 * @param {object} data the contents of the line to add; it will always be converted to a string.
 * @param {string?} cssClass
 */
function appendData(data, cssClass) {
    var row = $('<li></li>')
            .append($('<time></time>').text(currentTime()))
            .append($('<span></span>')
                .addClass('raw')
                .text(data.toString())
            )
        .hide();

    if (cssClass) row.addClass(cssClass);

    var $data = $('#data');
    $data.prepend(row);

    row.fadeIn();

    $('li:gt(' + (rowLimit-1) + ')', $data).remove();
}

/**
 * Returns the current local time as a string following the HH:MM:SS.mmmm format
 * @returns {string}
 */
function currentTime() {
    // helper method to generate two-digit strings from a number by prefixing zeros; very useful for dates and times.
    function pad(s, len) {
        if (typeof s !== 'string')
            s = s.toString();
        return s.length < len ? '0'.repeat(len - s.length) + s : s;
    }
    var d = new Date();
    return '{0}:{1}:{2}.{3}'.format(pad(d.getHours(), 2), pad(d.getMinutes(), 2), pad(d.getSeconds(), 2), pad(d.getMilliseconds(), 4));
}

if (!String.prototype.repeat)
    /**
     * Repeats the string num times.
     * @param {int} num How often the string should be repeated.
     * @returns {string} a new string containing the original string repeated num-times.
     */
    String.prototype.repeat = function(num) {
        return new Array(num + 1).join(this);
    };

if (!String.prototype.format)
    /**
     * Treats the string as a placeholder and injects arguments into it, similar to C#'s String.Format method sans
     * all the formatting options.
     * @returns {string}
     */
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined'
                ? args[number].toString()
                : match
                ;
        });
    };