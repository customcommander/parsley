const test = require('ava');
const parsley = require('../lib');

test.beforeEach(t => {
  t.context.raw = {
    tld: 'com',
    host: 'example.[tld]',
    api: {
      version: '1.0',
      path: 'https://[host]/api/[api.version]'
    },
    dev: {
      tld: 'dev',
      api: {
        version: '[api.version]-alpha'
      }
    }
  };
});

test('it should not modify the original object', t => {
  const raw = {
    tld: 'com', 
    host: 'example.[tld]',
    dev: {
      tld: 'dev'
    }
  };

  const rawClone = {
    tld: 'com', 
    host: 'example.[tld]',
    dev: {
      tld: 'dev'
    }
  };

  parsley(raw);
  t.deepEqual(raw, rawClone);
  
  parsley(raw, 'dev');
  t.deepEqual(raw, rawClone);
});

test('it should replaces all tokens within an object', t => {
  const parsed = parsley(t.context.raw);

  t.deepEqual(parsed, {
    tld: 'com',
    host: 'example.com',
    api: {
      version: '1.0',
      path: 'https://example.com/api/1.0'
    },
    dev: {
      tld: 'dev',
      api: {
        version: '1.0-alpha'
      }
    }
  });
});

test('you can override the base object with a key to an another object', t => {
  const parsed = parsley(t.context.raw, 'dev');

  t.deepEqual(parsed, {
    tld: 'dev',
    host: 'example.dev',
    api: {
      version: '1.0-alpha',
      path: 'https://example.dev/api/1.0-alpha'
    },
    dev: {
      tld: 'dev',
      api: {
        version: '1.0-alpha'
      }
    }
  });
});
