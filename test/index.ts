'use strict'

import test       from 'ava'
import { spy }    from 'sinon'
import { Router } from '../lib'

test('call action if matched route', t => {
  const router = new class extends Router {
    homeAction = spy()

    home2Action = spy()
    
    routes = {
      '/home' : this.homeAction,
      '/home2': this.home2Action
    }
  }

  router.dispatch('/home')

  // match route
  t.true(router.homeAction.called)

  // unmatch route
  t.true(router.home2Action.notCalled)

  t.true(router['_paramsMap'].size === 0)
})

test('named params', t => {
  const router = new class extends Router {
    userAction = spy()

    userMessageAction = spy()
    
    routes = {
      '/users/:userId'                    : this.userAction,
      '/users/:userId/messages/:messageId': this.userMessageAction
    }
  }

  router.dispatch('/users/100')

  t.true(router.userAction.called)
  t.true(router.userMessageAction.notCalled)

  t.true(router.params('userId') === '100')

  t.true(router['_paramsMap'].size === 1)

  router.userAction.reset()
  router.userMessageAction.reset()

  router.dispatch('/users/1000/messages/1')

  t.true(router.userAction.notCalled)
  t.true(router.userMessageAction.called)

  t.true(router.params('userId') === '1000')
  t.true(router.params('messageId') === '1')

  t.true(router['_paramsMap'].size === 2)
})

test('dispatch result should return Promise', t => {
  const router = new class extends Router {
    homeAction = spy()

    routes = {
      '/home': this.homeAction
    }
  }

  return Promise.all([
    // matched
    router.dispatch('/home').then(
      () => t.pass(),
      () => t.fail()
    ),

    // unmatched
    router.dispatch('/404').then(
      () => t.fail(),
      () => t.pass()
    )
  ])
})
