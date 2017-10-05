const utils = require('./object-utils');

/**
 * Returns details about the first token found in given string or null if there are no tokens.
 *
 * Details include the full token expression and the name of the token.
 *
 * @example
 * getToken('foo[[val]]');
 * //=> {expr:'[[val]]', name: 'val'}
 *
 * getToken('foobar');
 * //=> null
 *
 * @param {string} str
 * @return {object} Details about the token
 */
function getToken(str) {
    let match = str.match(/\[\[(.+?)\]\]/);
    return !match ? null : {
        expr: match[0],
        name: match[1]
    };
}

function parseString(str, dict) {
    let token;
    while (token = getToken(str)) {
        let value = utils.find(token.name, dict);
        if (typeof value === 'undefined') {
            throw new Error(`'${token.name}' not found`);
        }
        str = str.replace(token.expr, value);
    }
    return str;
}

function parse(obj, dict) {
    return Object.keys(obj).reduce((parsed, key) => {
        if (utils.isObject(obj[key])) {
            parsed[key] = parse(obj[key], dict);
        } else if (typeof obj[key] === 'string') {
            parsed[key] = parseString(obj[key], dict)
        } else {
            parsed[key] = obj[key];
        }
        return parsed;
    }, {});
}

module.exports = function (obj, dict) {
    if (!utils.isObject(dict)) {
        dict = utils.clone(obj);
    }
    return parse(obj, dict);
};
