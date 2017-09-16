const utils = require('./object-utils');
const parse = require('./parse');

/**
 * @param {object} obj An object with tokens in it
 * @param {string} [mergeKey] A key to a sub object within the first argument
 * @return {object}
 */
module.exports = function (obj, mergeKey) {
    if (!utils.isObject(obj)) {
        throw new Error('invalid argument: obj is not an object');
    }

    if (typeof mergeKey === 'undefined') {
        return parse(obj);
    }

    if (typeof mergeKey !== 'string' || !utils.isObject(obj[mergeKey])) {
        throw new Error('invalid argument: mergeKey must be a key to an object');
    }

    obj[mergeKey] = parse(obj[mergeKey], obj);
    obj = utils.merge(obj, obj[mergeKey]);
    return parse(obj);
};
