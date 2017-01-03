# @isoden/router

minimal router for client side.

---

## Installation

```
$ npm install @isoden/router --save
```

## Usage

```ts
// routing.ts
import { Router } from '@isoden/router'

export class AppRouter extends Router {
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

import { AppRouter } from './routing'

const router = new AppRouter()

router.dispatch('/').then(() => {
  // matched routing
  // called AppRouter#indexAction
})

router.dispatch('/404').catch(() => {
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
