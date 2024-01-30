import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class UrlProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) { }

  public register() {
    this.app.container.singleton('UrlService', () => {
      const UrlService = require('App/Services/UrlService').default
      return new UrlService()
    })
  }
}
