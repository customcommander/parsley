# parsley

[![Build Status](https://travis-ci.org/customcommander/parsley.svg?branch=master)](https://travis-ci.org/customcommander/parsley)

> Parses an object and replaces tokens with values from that object

```
npm install @customcommander/parsley
```

```javascript
const parsley = require('parsley');

const config = parsley({
  host: 'example.com',
  app: 'https://${host}/app',
  account: {
    username: 'john.doe@${host}',
    password: '123',
    profile: '${app}/profiles/${account.username}'
  },
  testing: {
    host: 'dev.example.com',
    account: {
      username: 'test.${account.username}'
    }
  }
});

config.get('app');
// https://example.com/app

config.merge('testing').get('app');
// https://dev.example.com/app

config.exports();
/*
{
  host: 'example.com',
  app: 'https://example.com/app',
  account: {
    username: 'john.doe@example.com',
    password: '123',
    profile: 'https://example.com/app/profiles/john.doe@example.com'
  },
  testing: {
    host: 'dev.example.com',
    account: {
      username: 'test.john.doe@dev.example.com'
    }
  }
}
*/

config.merge('testing').exports();
/*
{
  host: 'dev.example.com',
  app: 'https://dev.example.com/app',
  account: {
    username: 'test.john.doe@dev.example.com',
    password: '123',
    profile: 'https://dev.example.com/app/profiles/test.john.doe@dev.example.com'
  }
}
*/
```
