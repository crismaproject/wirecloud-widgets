// as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(predicate) {
            if (this == null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                if (i in list) {
                    value = list[i];
                    if (predicate.call(thisArg, value, i, list)) {
                        return value;
                    }
                }
            }
            return undefined;
        }
    });
}

if (!Array.prototype.binaryIndexOf)
    /**
     * Performs a binary search on the host array. This method can either be
     * injected into Array.prototype or called with a specified scope like this:
     * binaryIndexOf.call(someArray, searchElement);
     *
     * @param {*} searchElement The item to search for within the array.
     * @return {Number} The index of the element which defaults to -1 when not found.
     */
    Array.prototype.binaryIndexOf = function (searchElement) {
        'use strict';

        var minIndex = 0;
        var maxIndex = this.length - 1;
        var currentIndex;
        var currentElement;

        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = this[currentIndex];

            if (currentElement < searchElement)
                minIndex = currentIndex + 1;
            else if (currentElement > searchElement)
                maxIndex = currentIndex - 1;
            else
                return currentIndex;
        }

        return -1;
    };