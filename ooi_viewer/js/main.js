/**
 * Creates a new OOI Viewer instance.
 * @param {string} container a CSS selector declaring the container to use (should be - or contain - a &lt;table&gt;)
 * @constructor
 */
function OOIViewer(container) {
    this.container = container;

    this.actionCallbacks = {};
}

/**
 * Sets the table's contents.
 * @param {string} identifier the OOI's identifier.
 * @param {Object} obj
 */
OOIViewer.prototype.set = function (identifier, obj) {
    var tbody = $(this.container).find('tbody');
    tbody.find('.gen').remove();
    tbody.find('.ooi-id').text(identifier);

    for (var key in obj) {
        var value = obj[key] != null ? obj[key].toString() : '';
        var row = $('<tr></tr>').addClass('gen')
            .append($('<th></th>').text(key))
            .append($('<td></td>').text(value));
        tbody.append(row);
    }
}

/**
 * @param label
 * @param callback
 * @returns {string} identifier
 */
OOIViewer.prototype.addAction = function (label, callback) {
    this.removeAction.call(this, label);
    var uid = generateIdentifier();
    this.actionCallbacks[uid] = callback;
    $(this.container).find('.actions').append(
        $('<button></button>')
            .addClass('btn')
            .addClass('a_' + uid.toUpperCase())
            .text(label)
            .click(callback)
    );
    return uid;
}

/**
 * @param uid
 */
OOIViewer.prototype.removeAction = function (uid) {
    if (this.actionCallbacks.hasOwnProperty(uid)) {
        $(this.container).find('.actions button.a_' + uid.toUpperCase()).remove();
        delete this.actionCallbacks[uid];
    }
}

/**
 * Generates an RFC 4122 v4 compliant unique identifier.
 * (Kindly borrowed from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript)
 * @returns {string} a 32 characters long unique identifier with separators.
 */
function generateIdentifier() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}