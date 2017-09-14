const utils = require('./object-utils');
const parse = require('./parse');

/**
 * 
 * @param {object} raw 
 */
function Parsley(raw) {
    Object.defineProperty(this, 'raw', {value: raw});
    Object.defineProperty(this, 'parsed', {value: parse(raw)});
}

/**
 * @param {string} key
 * @return {any}
 */
Parsley.prototype.get = function (key) {
    if (typeof key !== 'string') {
        throw new Error('invalid argument: `key` is not a string');
    }
    let val = utils.find(key, this.parsed);
    if (typeof val === 'undefined') {
        throw new Error(`'${key}' not found`);
    }
    return val;
};

Parsley.prototype.merge = function (key) {
    if (typeof key !== 'string') {
        throw new Error('invalid argument: `key` is not a string');
    }
    let raw = utils.clone(this.raw);
    let subRaw = utils.find(key, raw);
    if (!utils.isObject(subRaw)) {
        throw new Error(`cannot merge '${key}' as it does not hold an object`);
    }
    let subParsed = parse(subRaw, raw);
    delete raw[key];
    return new Parsley(utils.merge(raw, subParsed));
};

Parsley.prototype.exports = function () {
    return utils.clone(this.parsed);
};

module.exports = function (obj) {
    if (!utils.isObject(obj)) {
        throw new Error('invalid argument: `obj` is not an object');
    }
    return new Parsley(obj);
};
