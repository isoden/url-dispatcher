'use strict'

/** コールバック型 */
export interface Action {
  (): void
}

/** ルート型 */
export interface Routes {
  [route: string]: Action
}

export abstract class Router {
  abstract routes: Routes

  baseUrl = ''

  suffix = ''

  private _names: string[] = []

  private _paramsMap = new Map<string, string>()

  params(name: string) {
    return this._paramsMap.get(name)
  }

  dispatch(url: string) {
    return new Promise<void>((resolve, reject) => {
      this._paramsMap.clear()

      const matched = Object.entries(this.routes).some(([route, action]) => {
        const rxroute = this._routeToRegExp(route)
        const result  = rxroute.exec(url)

        if (result !== null) {
          this._names.forEach((name, i) => this._paramsMap.set(name, result[i + 1]));
          action()
        }

        return result !== null
      })

      matched ? resolve() : reject()
    })
  }

  private _routeToRegExp(route: string) {
    const { baseUrl, suffix } = this
    
    this._names = []

    const namedRoute = route.replace(/(:(\w+))/g, (_: string, _1: string, param: string) => {
      this._names.push(param)

      return '(\\w+)'
    })

    return new RegExp(`^${ baseUrl }${ namedRoute }${ suffix }$`)
  }
}
