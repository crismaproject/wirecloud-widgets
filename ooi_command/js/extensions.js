/**
 * Groups the provided array of objects into an object where the object's properties are values extracted
 * from the keyProperty property of array elements, and each keyed entry in the object is an array of
 * elements sharing the same key.
 *
 * @param {string} keyProperty
 * @returns {{}}
 */
Array.prototype.group = function(keyProperty) {
    var groups = { };

    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (!obj.hasOwnProperty(keyProperty)) continue;
        var key = obj[keyProperty];
        if (!(key in groups))
            groups[key] = [ obj ];
        else
            groups[key].push(obj);
    }

    return groups;
};

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
 * Returns only elements of the specified array that satisfy the specified predicate.
 *
 * @param {function} predicate a function that tests an element of the array and returns true iff it is to be included
 * in the returned array; otherwise it will not be included.
 * @returns {Array} an array where every element of the original array is included iff the predicate returned true.
 */
Array.prototype.only = function(predicate) {
    var newArray = [ ];
    for (var i = 0; i < this.length; i++)
        if (predicate(this[i]))
            newArray.push(this[i]);
    return newArray;
};