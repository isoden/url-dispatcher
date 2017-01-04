# @isoden/url-dispatcher

minimal url dispatcher for client side.

[![npm (scoped)](https://img.shields.io/npm/v/@isoden/url-dispatcher.svg)](https://www.npmjs.com/package/@isoden/url-dispatcher)
[![Coverage Status](https://coveralls.io/repos/github/isoden/url-dispatcher/badge.svg?branch=master)](https://coveralls.io/github/isoden/url-dispatcher?branch=master)

---

## Installation

```
$ npm install @isoden/url-dispatcher --save
```

## Usage

```ts
// dispatcher.ts
import { UrlDispatcher } from '@isoden/url-dispatcher'

export class Dispatcher extends UrlDispatcher {
  routes = {
    '/'             : this.indexAction.bind(this),
    '/about'        : this.aboutAction.bind(this),
    '/users/:userId': this.userAction.bind(this)
  }

  indexAction() {
    console.log('here is index')
  }

  aboutAction() {
    console.log('here is about')
  }

  userAction() {
    const userId = this.params('userId')

    console.log(`here is user => ${ userId }`)
  }
}

```

```ts
// main.ts

import { Dispatcher } from './dispatcher'

const dispatcher = new Dispatcher()

dispatcher.dispatch('/').then(() => {
  // matched routing
  // called Dispatcher#indexAction
})

dispatcher.dispatch('/404').catch(() => {
  // unmatched routing
})

```

### Note

The following implementation is required.

- Object.entries
- ES6 Promise
- ES6 Map

Please import alternate implementation as necessary.

```
$ npm install core-js --save
```

```ts
import 'core-js/fn/object/entries'
import 'core-js/fn/promise'
import 'core-js/fn/map'
```

## License

Under The MIT License
