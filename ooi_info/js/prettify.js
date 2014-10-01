angular.module('ooiInfo.prettify', [])
    .factory('prettify', function () {
        var Rule = function () {
            this.entityIds = [];
            this.propertyIds = [];
            this.toStringCallback = null;
            this.titleCallback = null;
        };

        /**
         * @param {int} entityTypeId
         * @param {int} propertyId
         * @return {boolean}
         */
        Rule.prototype.isApplicable = function (entityTypeId, propertyId) {
            return (this.entityIds.length == 0 || this.entityIds.indexOf(entityTypeId) != -1) && (this.propertyIds.length == 0 || this.propertyIds.indexOf(propertyId) != -1);
        };

        /**
         * @param {int|String} propertyValue
         * @param {int} entityTypeId
         * @param {int} propertyId
         * @return {*}
         */
        Rule.prototype.toString = function (propertyValue, entityTypeId, propertyId) {
            return this.toStringCallback.call(this, propertyValue, entityTypeId, propertyId);
        };

        Rule.prototype.toTitle = function (propertyValue, entityTypeId, propertyId) {
            return this.titleCallback.call(this, propertyValue, entityTypeId, propertyId);
        };

        /**
         * @param {int} entityTypeId
         * @return {Rule}
         */
        Rule.prototype.forEntityType = function (entityTypeId) { this.entityIds.push(entityTypeId); return this; };

        /**
         * @param {int} propertyId
         * @return {Rule}
         */
        Rule.prototype.forProperty = function (propertyId) { this.propertyIds.push(propertyId); return this; };

        /**
         * @param {Function} callback
         * @return {Rule}
         */
        Rule.prototype.thenDo = function (callback) { this.toStringCallback = callback; return this; };

        Rule.prototype.useTitle = function (callback) { this.titleCallback = callback; return this; }

        var Prettifier = function () {
            this.rules = [];
        };

        /**
         * @return {Rule}
         */
        Prettifier.prototype.rule = function () {
            var rule = new Rule();
            this.rules.push(rule);
            return rule;
        };

        /**
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