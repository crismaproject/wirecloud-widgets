/*global jQuery,jQuery.Deferred*/

/*
    This will eventually become a streamlined replacement for any and all OOI-WSR operations.
                                                          - Manuel Warum (AIT), Oct 28, 2013
                                                                 <manuel.warum.fl@ait.ac.at>
 */

/**
 * @param {string} apiUri the OOI-WSR's API URI
 * @constructor
 */
var WorldStateRepository = function (apiUri) {
    /**
     * @type {string} the OOI-WSR's API URI
     * @private
     */
    this.apiUri = apiUri;
};

/**
 * Creates a fully qualified URL for the specified resource path. If a resource ID is provided,
 * the path will point at the resource URL; otherwise it will point to the resource collection.
 * @param {string} path
 * @param {number?} entityId
 * @returns {string}
 * @private
 */
WorldStateRepository.prototype.createUrl = function(path, entityId) {
    var uri = this.apiUri + '/' + path;
    if (entityId) uri += '/' + entityId;
    return uri;
};

/**
 * Fetches all entities from a resource collection.
 * @param {string} path
 * @param {*?} data
 * @returns {jQuery.Deferred}
 * @private
 */
WorldStateRepository.prototype.fetch = function(path, data) {
    return $.get(this.createUrl(path), data);
};

/**
 * Fetches a single resource identified by its unique identifier.
 * @param {string} path
 * @param {number} entityId
 * @param {*?} data
 * @returns {jQuery.Deferred}
 * @private
 */
WorldStateRepository.prototype.fetchById = function(path, entityId, data) {
    return $.get(this.createUrl(path, entityId), data);
};

/**
 * Inserts a single (new) resource instance.
 * @param {string} path
 * @param {object} instance
 * @returns {jQuery.Deferred}
 * @private
 */
WorldStateRepository.prototype.singleInsert = function(path, instance) {
    return $.post(this.createUrl(path), instance);
};

/**
 * Updates/replaces a single resource instance.
 * @param {string} path
 * @param {number} entityId
 * @param {object} instance
 * @returns {jQuery.Deferred}
 * @private
 */
WorldStateRepository.prototype.singleReplace = function(path, entityId, instance) {
    return $.ajax({
        data: instance,
        type: 'PUT',
        url: this.createUrl(path, entityId)
    });
};

/**
 * Deletes a single resource instance identified by its unique identifier.
 * @param {string} path
 * @param {number} entityId
 * @returns {jQuery.Deferred}
 * @private
 */
WorldStateRepository.prototype.singleDelete = function(path, entityId) {
    return $.ajax({
        type: 'DELETE',
        url: this.createUrl(path, entityId)
    });
};

/**
 * Performs a mass insert of resource instances.
 * @param {string} path
 * @param {object[]} data
 * @returns {jQuery.Deferred}
 * @private
 */
WorldStateRepository.prototype.massInsert = function(path, data) {
    return $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(data),
        processData: false,
        type: 'POST',
        url: this.createUrl(path)
    });
};

(function () {
    var pathsWithDefautBehaviour = [
        'Entity',
        'EntityTypeProperty',
        'Event',
        'WorldState',
        'EntityType',
        'EntityGeometry',
        'Simulation',
        'EntityProperty'
    ];

    var pathsWithCollectionBehaviour = [
        'EntityProperties',
        'EntityGeometries'
    ];

    var pluralize = function(string) {
        return string.match(/y$/) ? string.replace(/y$/, 'ies') : string + 's';
    };

    function wireDefault(path) {
        WorldStateRepository.prototype['list' + pluralize(path)] = function () { return this.fetch(path); };
        WorldStateRepository.prototype['get' + path] = function (id) { return this.fetchById(path, id); };
        WorldStateRepository.prototype['insert' + path] = function (data) { return this.singleInsert(path, data); };
        WorldStateRepository.prototype['update' + path] = function (id, data) { return this.singleReplace(path, id, data); };
        WorldStateRepository.prototype['delete' + path] = function (id) { return this.singleDelete(path, id); };
    }

    function wireCollection(path) {
        WorldStateRepository.prototype['insert' + path] = function (data) { return this.massInsert(path, data); };
    }

    var i;
    for (i = 0; i < pathsWithDefautBehaviour.length; i++)
        wireDefault(pathsWithDefautBehaviour[i]);
    for (i = 0; i < pathsWithCollectionBehaviour.length; i++)
        wireCollection(pathsWithCollectionBehaviour[i]);
})();