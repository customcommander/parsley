const test = require('ava');
const parsley = require('../lib');

test.beforeEach(t => {
  t.context.obj = parsley({
    tld: 'com',
    host: 'example.${tld}',
    api: {
      version: '1.0',
      path: 'https://${host}/api/${api.version}'
    },
    dev: {
      tld: 'dev',
      api: {
        version: '${api.version}-alpha'
      }
    }
  });
});

test('parsley(obj): returns a new object with some methods in it', t => {
  t.false(t.context.obj.tld === 'com', 'it should not expose the original properties');
  t.is(typeof t.context.obj.get, 'function', '.get() is missing');
  t.is(typeof t.context.obj.merge, 'function', '.merge() is missing');
  t.is(typeof t.context.obj.exports, 'function', '.exports() is missing');
});

test('.get(key): returns the value with all tokens replaced', t => {
  t.is(t.context.obj.get('tld'), 'com');
  t.is(t.context.obj.get('host'), 'example.com');
  t.is(t.context.obj.get('api.version'), '1.0');
  t.is(t.context.obj.get('api.path'), 'https://example.com/api/1.0');
  t.is(t.context.obj.get('dev.tld'), 'dev');
  t.is(t.context.obj.get('dev.api.version'), '1.0-alpha');
});

test('.get(key): throws an error if key is not a string', t => {
  t.throws(() => t.context.obj.get([]));
});

test('.get(key): throws an error if key is not found', t => {
  t.throws(() => t.context.obj.get('wtf'));
  t.throws(() => t.context.obj.get('api.wtf'));
});

test('.get(key): key can contain dots in it', t => {
  const obj = parsley({
    'a.b': 1,
    b: {
      'c.d': 2
    }
  });

  t.is(obj.get('a.b'), 1);
  t.is(obj.get('b.c.d'), 2);
});

test('.merge(key): returns an object similar to what parsley() returns', t => {
  const merged = t.context.obj.merge('dev');
  t.is(typeof merged.tld, 'undefined');
  t.deepEqual(merged.prototype, t.context.obj.prototype);
});

test('.merge(key): overrides the base object', t => {
  const merged = t.context.obj.merge('dev').exports();
  t.deepEqual(merged, {
    tld: 'dev',
    host: 'example.dev',
    api: {
      version: '1.0-alpha',
      path: 'https://example.dev/api/1.0-alpha'
    }
  });
});

test('.merge(key): throws an error if key is not a string', t => {
  t.throws(() => t.context.obj.merge([]));
});

test('.merge(key): throws an error if key is not found', t => {
  t.throws(() => t.context.obj.merge('wtf'));
  t.throws(() => t.context.obj.merge('api.wtf'));
});

test('.merge(key): throws an error if key does not contain an object', t => {
  t.throws(() => t.context.obj.merge('tld'));
});

test('.merge(key): key can contain dots in it', t => {
  const obj = parsley({
    foo: 'bar',
    'a.b': {
      foo: 'bar2'
    },
    'b': {
      'c.d': {
        foo: 'bar3'
      }
    }
  });

  t.is(obj.merge('a.b').get('foo'), 'bar2');
  t.is(obj.merge('b.c.d').get('foo'), 'bar3');
});

test('.exports(): exports an object with all tokens replaced', t => {
  t.deepEqual(t.context.obj.exports(), {
    tld: 'com',
    host: 'example.com',
    api: {
      version: '1.0',
      path: 'https://example.com/api/1.0'
    },
    dev: {
      tld: 'dev',
      api: {
        version: '1.0-alpha',
      }
    }
  });
});

