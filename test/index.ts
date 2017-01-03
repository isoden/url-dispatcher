'use strict'

import test       from 'ava'
import { spy }    from 'sinon'
import { UrlDispatcher } from '../lib'

test('call action if matched route', t => {
  const dispatcher = new class extends UrlDispatcher {
    homeAction = spy()

    home2Action = spy()
    
    routes = {
      '/home' : this.homeAction,
      '/home2': this.home2Action
    }
  }

  dispatcher.dispatch('/home')

  // match route
  t.true(dispatcher.homeAction.called)

  // unmatch route
  t.true(dispatcher.home2Action.notCalled)

  t.true(dispatcher['_paramsMap'].size === 0)
})

test('named params', t => {
  const dispatcher = new class extends UrlDispatcher {
    userAction = spy()

    userMessageAction = spy()
    
    routes = {
      '/users/:userId'                    : this.userAction,
      '/users/:userId/messages/:messageId': this.userMessageAction
    }
  }

  dispatcher.dispatch('/users/100')

  t.true(dispatcher.userAction.called)
  t.true(dispatcher.userMessageAction.notCalled)

  t.true(dispatcher.params('userId') === '100')

  t.true(dispatcher['_paramsMap'].size === 1)

  dispatcher.userAction.reset()
  dispatcher.userMessageAction.reset()

  dispatcher.dispatch('/users/1000/messages/1')

  t.true(dispatcher.userAction.notCalled)
  t.true(dispatcher.userMessageAction.called)

  t.true(dispatcher.params('userId') === '1000')
  t.true(dispatcher.params('messageId') === '1')

  t.true(dispatcher['_paramsMap'].size === 2)
})

test('dispatch result should return Promise', t => {
  const dispatcher = new class extends UrlDispatcher {
    homeAction = spy()

    routes = {
      '/home': this.homeAction
    }
  }

  return Promise.all([
    // matched
    dispatcher.dispatch('/home').then(
      () => t.pass(),
      () => t.fail()
    ),

    // unmatched
    dispatcher.dispatch('/404').then(
      () => t.fail(),
      () => t.pass()
    )
  ])
})
