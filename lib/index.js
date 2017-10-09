import {isObject, clone, merge} from './object-utils';
import parse from './parse';

/**
 * @param {object} obj An object with tokens in it
 * @param {string} [mergeKey] A key to a sub object within the first argument
 * @return {object}
 */
export default function (obj, mergeKey) {
    if (!isObject(obj)) {
        throw new Error('invalid argument: obj is not an object');
    }

    if (typeof mergeKey === 'undefined') {
        return parse(obj);
    }

    if (typeof mergeKey !== 'string' || !isObject(obj[mergeKey])) {
        throw new Error('invalid argument: mergeKey must be a key to an object');
    }

    obj = clone(obj);
    obj[mergeKey] = parse(obj[mergeKey], obj);
    obj = merge(obj, obj[mergeKey]);
    return parse(obj);
};
