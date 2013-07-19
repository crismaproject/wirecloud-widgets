/**
 * @param {string} container
 * @constructor
 */
function OOIViewer(container) {
    this.container = container;
}

/**
 * @param {string} identifier
 * @param {Object} obj
 */
OOIViewer.prototype.set = function (identifier, obj) {
    var tbody = $(this.container).find('tbody');
    tbody.find('.gen').remove();
    tbody.find('.ooi-id').text(identifier);

    for(var key in obj) {
        var value = obj[key] != null ? obj[key].toString() : '';
        var row = $('<tr></tr>').addClass('gen')
            .append($('<th></th>').text(key))
            .append($('<td></td>').text(value));
        tbody.append(row);
    }
}