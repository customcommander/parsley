import test from 'ava';
import parsley from '../lib';

function sample() {
  return {
    tld: 'com',
    host: 'example.[[tld]]',
    api: {
      version: '1.0',
      path: 'https://[[host]]/api/[[api.version]]'
    },
    timeout: 1000,
    dev: {
      tld: 'dev',
      api: {
        version: '[[api.version]]-alpha'
      },
      timeout: 2000,
      debug: {
        api_version: '[[dev.api.version]]'
      }
    }
  };
}

test('parsley(obj): it should return an object', t => {
  var parsed = parsley(sample());
  t.is(String(parsed), String({}));
});

test('parsley(obj, mergeKey): it should return an object', t => {
  var parsed = parsley(sample(), 'dev');
  t.is(String(parsed), String({}));
});

test('parsley(obj): it should not modify `obj`', t => {
  var raw = sample();
  parsley(raw);
  t.deepEqual(raw, sample());
});

test('parsley(obj, mergeKey): it should not modify `obj`', t => {
  var raw = sample();
  parsley(raw, 'dev');
  t.deepEqual(raw, sample());
});

test('parsley(obj): it should replace all tokens', t => {
  t.deepEqual(parsley(sample()), {
    tld: 'com',
    host: 'example.com',
    api: {
      version: '1.0',
      path: 'https://example.com/api/1.0'
    },
    timeout: 1000,
    dev: {
      tld: 'dev',
      api: {
        version: '1.0-alpha'
      },
      timeout: 2000,
      debug: {
        api_version: '1.0-alpha'
      }
    }
  });
});

test('parsley(obj, mergeKey): it should replace all tokens', t => {
  t.deepEqual(parsley(sample(), 'dev'), {
    tld: 'dev',
    host: 'example.dev',
    api: {
      version: '1.0-alpha',
      path: 'https://example.dev/api/1.0-alpha'
    },
    timeout: 2000,
    debug: {
      api_version: '1.0-alpha'
    },
    dev: {
      tld: 'dev',
      api: {
        version: '1.0-alpha'
      },
      timeout: 2000,
      debug: {
        api_version: '1.0-alpha'
      }
    }
  });
});

test('parsley(obj): throws an error if `obj` is not an object', t => {
  t.throws(() => parsley([]));
  t.throws(() => parsley(null));
});

test('parsley(obj, mergeKey): throws an error if `obj` is not an object', t => {
  t.throws(() => parsley([], 'dev'));
  t.throws(() => parsley(null, 'dev'));
});

test('parsley(obj, mergeKey): throws an error if `mergeKey` is not a string', t => {
  t.throws(() => parsley(sample(), 123));
});

test('parsley(obj, mergeKey): throws an error if `mergeKey` does not point to an object', t => {
  t.throws(() => parsley(sample(), 'host'));
});

test('parsley(obj): throws an error if a token cannot be resolved', t => {
  t.throws(() => parsley({foo: '[[xxx]]'}));
});

test('parsley(obj, mergeKey): throws an error if a token cannot be resolved', t => {
  t.throws(() => parsley({foo: 'foo', bar: {foo: '[[xxx]]'}}, 'bar'));
});


test('parsley(obj): should handle complex parsing', t => {
  var parsed = parsley({
    foo: '[[a.b.c.d]]',
    a: {
      b: {
        c: {
          d: '[[a.value]][[a.b.value]][[a.b.c.value]][[a.b.c.x.y.z]]',
          'x.y.z': '!',
          value: 'r'
        },
        value: 'a'
      },
      value: 'b'
    }
  });
  t.is(parsed.foo, 'bar!');
});