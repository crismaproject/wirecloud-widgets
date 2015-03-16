angular.module('ooiInfo.prettify', [])
    .factory('prettify', function () {
        /**
         * This is a class that encapsulates a rule that determines how an entity should be labeled. It is composed of
         * id-based preconditions and a toString function.
         * @constructor
         */
        var Rule = function () {
            this.entityIds = [];
            this.propertyIds = [];
            this.toStringCallback = null;
            this.titleCallback = null;
        };

        /**
         * Determines if this rule can be applied to an object instance with the specified ids.
         * @param {int} entityTypeId
         * @param {int} propertyId
         * @return {boolean}
         */
        Rule.prototype.isApplicable = function (entityTypeId, propertyId) {
            return (this.entityIds.length == 0 || this.entityIds.indexOf(entityTypeId) != -1) && (this.propertyIds.length == 0 || this.propertyIds.indexOf(propertyId) != -1);
        };

        /**
         * Generates a string representation of the object this rule applies to.
         * @param {int|String} propertyValue
         * @param {int} entityTypeId
         * @param {int} propertyId
         * @return {String}
         */
        Rule.prototype.toString = function (propertyValue, entityTypeId, propertyId) {
            return this.toStringCallback.call(this, propertyValue, entityTypeId, propertyId);
        };

        /**
         * Generates a string representation of the object this rule applies to in the context of tooltips.
         * @param {int|String} propertyValue
         * @param {int} entityTypeId
         * @param {int} propertyId
         * @return {String}
         */
        Rule.prototype.toTitle = function (propertyValue, entityTypeId, propertyId) {
            return this.titleCallback.call(this, propertyValue, entityTypeId, propertyId);
        };

        /**
	 * Sets for which types of entities this rules applies to.
         * @param {int} entityTypeId
         * @return {Rule}
         */
        Rule.prototype.forEntityType = function (entityTypeId) { this.entityIds.push(entityTypeId); return this; };

        /**
	 * Sets for which properties this rule applies to.
         * @param {int} propertyId
         * @return {Rule}
         */
        Rule.prototype.forProperty = function (propertyId) { this.propertyIds.push(propertyId); return this; };

        /**
	 * Sets the callback that generates a string representation of object instances satisfying the preconditions.
         * @param {Function} callback
         * @return {Rule}
         */
        Rule.prototype.thenDo = function (callback) { this.toStringCallback = callback; return this; };

        /**
	 * Sets the callback that generates the title string representation of object instances satisfying the preconditions.
         * @param {Function} callback
         * @return {Rule}
         */
        Rule.prototype.useTitle = function (callback) { this.titleCallback = callback; return this; };

        var Prettifier = function () {
            this.rules = [];
        };

        /**
	 * Creates a new, blank rule.
         * @return {Rule}
         */
        Prettifier.prototype.rule = function () {
            var rule = new Rule();
            this.rules.push(rule);
            return rule;
        };

        /**
	 * Generates a string representation of the object instance using the first rule matching its preconditions. If no rule applies, the propertyValue will be returned verbatim.
         * @param {int|String} propertyValue
         * @param {int} entityTypeId
         * @param {int} propertyId
         * @return {*}
         */
        Prettifier.prototype.toString = function (propertyValue, entityTypeId, propertyId) {
            for (var i = 0; i < this.rules.length; i++)
                if (this.rules[i].isApplicable(entityTypeId, propertyId) && this.rules[i].toStringCallback != null)
                    return this.rules[i].toString(propertyValue, entityTypeId, propertyId);
            return propertyValue;
        };

        Prettifier.prototype.toTitle = function (propertyValue, entityTypeId, propertyId) {
            for (var i = 0; i < this.rules.length; i++)
                if (this.rules[i].isApplicable(entityTypeId, propertyId) && this.rules[i].titleCallback != null)
                    return this.rules[i].toTitle(propertyValue, entityTypeId, propertyId);
            return null;
        };

        return new Prettifier();
    });
