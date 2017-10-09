'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj, mergeKey) {
    if (!(0, _objectUtils.isObject)(obj)) {
        throw new Error('invalid argument: obj is not an object');
    }

    if (typeof mergeKey === 'undefined') {
        return (0, _parse2.default)(obj);
    }

    if (typeof mergeKey !== 'string' || !(0, _objectUtils.isObject)(obj[mergeKey])) {
        throw new Error('invalid argument: mergeKey must be a key to an object');
    }

    obj = (0, _objectUtils.clone)(obj);
    obj[mergeKey] = (0, _parse2.default)(obj[mergeKey], obj);
    obj = (0, _objectUtils.merge)(obj, obj[mergeKey]);
    return (0, _parse2.default)(obj);
};

var _objectUtils = require('./object-utils');

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * @param {object} obj An object with tokens in it
 * @param {string} [mergeKey] A key to a sub object within the first argument
 * @return {object}
 */