/**
 * Is the `thing` an object literal?
 * @param {any} thing
 * @return {boolean}
 */
function isObject(thing) {
    return String(thing) === '[object Object]';
}

/**
 * 
 * @param {string} key 
 * @param {object} obj 
 */
function find(key, obj) {
    if (isObject(obj) && obj.hasOwnProperty(key)) {
        return obj[key];
    }
    if (key.includes('.')) { // e.g. 'a.b.c'
        key = key.split('.');
        let top = key[0]; // e.g. 'a'
        let sub = key.slice(1).join('.'); // e.g. 'b.c'
        return find(sub, obj[top]);
    }
}

/**
 * Performs a deep clone of given object.
 * @param {object} obj
 * @return {object}
 */
function clone(obj) {
    return Object.keys(obj).reduce((cloned, key) => {
        if (isObject(obj[key])) {
            cloned[key] = clone(obj[key]);
        } else {
            cloned[key] = obj[key];
        }
        return cloned;
    }, {});
}

/**
 * Merges object `b` into object `a`.
 * @param {object} a
 * @param {object} b
 * @return {object}
 */
function merge(a, b) {
    return Object.keys(b).reduce((merged, key) => {
        if (isObject(a[key]) && isObject(b[key])) {
            merged[key] = merge(a[key], b[key]);
        } else if (isObject(b[key])) {
            merged[key] = clone(b[key]);
        } else {
            merged[key] = b[key];
        }
        return merged;
    }, clone(a));
}

module.exports = {
    isObject,
    find,
    clone,
    merge
};
