window.ooi_wsr_uri = 'http://localhost/api';

function OOITable(container) {
    /** @private */
    this.container = container;

    this.onSelected = function (row) {};
}

/**
 *
 * @param row the row to add
 * @param {string} row.id the OOI's unique identifier
 * @param {string} row.type the OOI's type
 * @param {string} row.site the OOI's current location
 * @param {object?} opt additional data that gets attached to the row's markup
 */
OOITable.prototype.addRow = function(row, opt) {
    var me = this;
    $('tbody', this.container).append(
        $('<tr></tr>')
            .append($('<th></th>').append('<input type="checkbox">'))
            .append($('<th></th>').text(row.id))
            .append($('<td></td>').text(row.type))
            .append($('<td></td>').text(row.site))
            .attr('data-orig', JSON.stringify(opt))
            .click (function () {
                $('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                if (me.onSelected)
                    me.onSelected(opt);
        })
    );
}

OOITable.prototype.clear = function() {
    $('tbody', this.container).empty();
}

OOITable.prototype.loadWorldState = function (wsId) {
    var uri = window.ooi_wsr_uri + '/Entity?wsid=' + wsId;
    var target = this;

    $.get(uri, function (data) {
        target.clear();
        for (var i = 0; i < data.length; i++)
            target.addRow({
                id: data[i].entityName,
                type: extractTypeFromEntity(data[i]),
                site: extractSiteFromEntity(data[i])
            }, data[i]);
    }, 'json');
}

var typeCache = {};
$.get(window.ooi_wsr_uri + '/EntityType', function (data) {
    for (var i = 0; i < data.length; i++)
        typeCache[data[i].entityTypeId] = data[i];
    console.log('Loaded entity types');
});

function extractTypeFromEntity(entity) {
    var entityTypeId = entity.entityTypeId;
    return typeof entityTypeId !== 'undefined' && typeof typeCache[entityTypeId] !== 'undefined' ? typeCache[entityTypeId].entityTypeName : '?';
}

function extractSiteFromEntity(entity) {
    return tryExtractPath(entity, '', 'entityInstancesGeometry', 0, 'geometry', 'geometry', 'wellKnownText');
}

function tryExtractPath(obj, defaultValue, path) {
    var scope = obj;
    for (var i = 2; i < arguments.length; i++) {
        scope = scope[arguments[i]];
        if (typeof scope === 'undefined')
            return defaultValue;
    }
    return scope;
}

$(function () {
    $('#check-all-none').change(function () {
        var checked = $(this).is(':checked');
        var targets = $('#ooi-table tbody input[type="checkbox"]');
        if (checked) targets.not(':checked').attr('checked', 'checked');
        else targets.filter(':checked').removeAttr('checked');
    });
});