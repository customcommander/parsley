# parsley

[![Build Status](https://travis-ci.org/customcommander/parsley.svg?branch=master)](https://travis-ci.org/customcommander/parsley)

> Parses an object and replaces tokens with values from that object

```
npm install @customcommander/parsley
```

```javascript
const parsley = require('@customcommander/parsley');
const config = {
  tld: 'com',
  host: 'example.[[tld]]',
  api: {
    version: '1.0',
    path: 'https://[[host]]/api/[[api.version]]'
  },
  dev: {
    tld: 'dev',
    api: {
      version: '[[api.version]]-alpha'
    }
  }
};

parsley(config);
// {
//   tld: 'com',
//   host: 'example.com',
//   api: {
//     version: '1.0',
//     path: 'https://example.com/api/1.0'
//   },
//   dev: {
//     tld: 'dev',
//     api: {
//       version: '1.0-alpha'
//     }
//   }
// }

parsley(config, 'dev');
// {
//   tld: 'dev',
//   host: 'example.dev',
//   api: {
//     version: '1.0-alpha',
//     path: 'https://example.dev/api/1.0-alpha'
//   },
//   dev: {
//     tld: 'dev',
//     api: {
//       version: '1.0-alpha'
//     }
//   }
// }
```
