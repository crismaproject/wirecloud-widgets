/**
 * Groups the provided array of objects into an object where the object's properties are values extracted
 * from the keyProperty property of array elements, and each keyed entry in the object is the first
 * element of the original array sharing the same key.
 *
 * @param {string} keyProperty
 * @returns {{}}
 */
Array.prototype.toDict = function(keyProperty) {
    var groups = { };

    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (!obj.hasOwnProperty(keyProperty)) continue;
        var key = obj[keyProperty];
        if (!(key in groups))
            groups[key] = obj;
    }

    return groups;
};

/**
 * An indexOf function that uses a predicate to find the index of the first element in an array that satisfies
 * the constraint.
 * @param {function} predicate a function that accepts an element of the array and returns true or false.
 * @param {object?} state an optional state that is passed along to the predicate.
 * @returns {number} the index of the first element in the array that satisfies the predicate.
 */
Array.prototype.indexOfWhere = function (predicate, state) {
    for (var i = 0; i < this.length; i++)
        if (predicate(this[i], state)) return i;
    return -1;
};