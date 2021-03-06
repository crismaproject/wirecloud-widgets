/*global jQuery,jQuery.Deferred*/

/*
    This will eventually become a streamlined replacement for any and all OOI-WSR operations.
                                                          - Manuel Warum (AIT), Oct 28, 2013
                                                                 <manuel.warum.fl@ait.ac.at>
 */

/**
 * @param {string} apiUri the OOI-WSR's API URI
 * @author Manuel Warum (AIT)
 * @version 0.6.1
 * @constructor
 */
function WorldStateRepository(apiUri) {
    /**
     * @type {string} the OOI-WSR's API URI
     * @private
     */
    this.apiUri = apiUri;
}

/**
 * Creates a fully qualified URL for the specified resource path. If a resource ID is provided,
 * the path will point at the resource URL; otherwise it will point to the resource collection.
 * @param {string} path the path (usually the resource's name) to fetch
 * @param {number?} entityId the unique identifier of the resource to fetch
 * @returns {string} a fully qualified URL pointing to the specified resource
 */
WorldStateRepository.prototype.createUrl = function(path, entityId) {
    var uri = this.apiUri + '/' + path;
    if (entityId) uri += '/' + entityId;
    return this.proxify(uri);
};

/**
 * Creates an URL pointing to the specified URL which is routed through Wirecloud's internal proxy iff
 * the MashupPlatform API is detected. Otherwise, the specified URL itself is returned without any changes.
 * The proxy address can be used to access data from external sources that would otherwise be inaccessible due to
 * the same-origin policy of browsers. Note that this method does not check if the specified URL is actually on a
 * foreign origin; it will simply assume it is and defer further processing to the buildProxyURL method of the
 * MashupPlatform API.
 * @param {string} url the URL you want to access
 * @returns {string} an URL pointing to the specified address
 */
WorldStateRepository.prototype.proxify = function(url) {
    return typeof (MashupPlatform) === 'undefined' ? url : MashupPlatform.http.buildProxyURL(url);
};

/**
 * Fetches all entities from a resource collection.
 * @param {string} path the resource's name
 * @param {*?} data any data that should be sent to the server
 * @returns {jQuery.Deferred} a jQuery deferred object instance for this request
 */
WorldStateRepository.prototype.fetch = function(path, data) {
    return $.get(this.createUrl(path), data);
};

/**
 * Fetches a single resource identified by its unique identifier.
 * @param {string} path the resource's name
 * @param {number} entityId the resource's unique identifier
 * @param {*?} data any data that should be sent to the server
 * @returns {jQuery.Deferred} a jQuery deferred object instance for this request
 */
WorldStateRepository.prototype.fetchById = function(path, entityId, data) {
    return $.get(this.createUrl(path, entityId), data);
};

/**
 * Inserts a single (new) resource instance.
 * @param {string} path the resource's name
 * @param {object} instance the instance to insert
 * @returns {jQuery.Deferred} a jQuery deferred object instance for this request
 */
WorldStateRepository.prototype.singleInsert = function(path, instance) {
    return $.post(this.createUrl(path), instance);
};

/**
 * Updates/replaces a single resource instance.
 * @param {string} path the resource's name
 * @param {number} entityId the resource's unique identifier
 * @param {object} instance the instance to replace
 * @returns {jQuery.Deferred} a jQuery deferred object instance for this request
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
 * @param {string} path the resource's name
 * @param {number} entityId the resource's unique identifier
 * @returns {jQuery.Deferred} a jQuery deferred object instance for this request
 */
WorldStateRepository.prototype.singleDelete = function(path, entityId) {
    return $.ajax({
        type: 'DELETE',
        url: this.createUrl(path, entityId)
    });
};

/**
 * Performs a mass insert of resource instances.
 * @param {string} path the resource's name
 * @param {object[]} data an array of resource instances that will be inserted on the server
 * @returns {jQuery.Deferred} a jQuery deferred object instance for this request
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

/*
 * the following function essentially creates all programmatically generated instance methods for the
 * WorldStateRepository class.
 */
(function () {
    /**
     * Resources for which default operations will be generated (list, get, insert, update, delete).
     * @const
     * @type {string[]}
     */
    var pathsWithDefaultBehaviour = [
        'Entity',
        'EntityTypeProperty',
        'Event',
        'WorldState',
        'EntityType',
        'EntityGeometry',
        'Simulation',
        'EntityProperty'
    ];

    /**
     * Resources for which mass operations will be generated (insert).
     * @const
     * @type {string[]}
     */
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
    for (i = 0; i < pathsWithDefaultBehaviour.length; i++)
        wireDefault(pathsWithDefaultBehaviour[i]);
    for (i = 0; i < pathsWithCollectionBehaviour.length; i++)
        wireCollection(pathsWithCollectionBehaviour[i]);
})();