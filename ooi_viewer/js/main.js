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
 * @param {Object} obj an object where keys are used as row headers and values as, well, values.
 * @example
 * ooiViewer.set(123, {'Name': 'Alice', 'Location': 'Wonderland'}) // shows an OOI with id 123, the name Alice and the location Wonderland.
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
};

/**
 * Creates a button in the UI that triggers a JavaScript function if it is clicked.
 * @param label The label that will be shown on the generated button.
 * @param callback a method that should be called when the generated button is clicked.
 * @returns {String} Returns a unique identifier that should be used for the removeAction method.
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
};

/**
 * Removes a previously registered button from the UI.
 * @param uid the unique identifier that was generated when the action was registered with addAction.
 */
OOIViewer.prototype.removeAction = function (uid) {
    if (this.actionCallbacks.hasOwnProperty(uid)) {
        $(this.container).find('.actions button.a_' + uid.toUpperCase()).remove();
        delete this.actionCallbacks[uid];
    }
};

/**
 * Generates an RFC 4122 v4 compliant unique identifier.
 * (Kindly borrowed from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript)
 * @returns {string} a 32 characters long unique identifier with separators.
 */
function generateIdentifier() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}