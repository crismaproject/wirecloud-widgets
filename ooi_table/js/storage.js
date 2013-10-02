/**
 * Stores arbitrary data in the HTML5 storage. Depending on availability, this is (in the order of priority) either
 * the HTML5 localStorage or the HTML5 sessionStorage. If neither is available, this function returns false. It returns
 * true only if either storage mechanism was available.
 * The data is transformed into a JSON-encoded string.
 * @param {string} key
 * @param {*} value
 * @returns {boolean} true, if the value was stored in either localStorage or sessionStorage; false otherwise.
 */
function remember (key, value) {
    var storage;
    if (typeof localStorage !== 'undefined') storage = localStorage;
    else if (typeof sessionStorage !== 'undefined') storage = sessionStorage;
    else return false;

    storage[key] = JSON.stringify(value);
    return true;
}

/**
 * Retrievs data from the HTML5 storage. Depending on availability, this is (in the order of priority) either
 * the HTML5 localStorage or the HTML5 sessionStorage. If neither is available, this function returns the specified
 * fallback value. In the case that data was retrieved but couldn't be decoded using JSON.parse, it will be deleted
 * from the session storage altogether and the fallback value will be returned.
 * @param {string} key
 * @param {*?} fallback
 * @returns {*}
 */
function recall (key, fallback) {
    var storage;
    if (typeof localStorage !== 'undefined') storage = localStorage;
    else if (typeof sessionStorage !== 'undefined') storage = sessionStorage;
    else return fallback;

    try {
        return storage.hasOwnProperty(key) ? JSON.parse(storage[key]) : fallback;
    } catch (e) {
        delete storage.key;
        return fallback;
    }
}