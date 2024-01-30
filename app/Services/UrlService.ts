import Env from '@ioc:Adonis/Core/Env'
import _ from 'lodash';

class UrlResolver {
  constructor(private name: string) { }

  get() {
    return this.name
  }

  join(...components: string[]): string {
    return [this.name, ...components].map((s) => _.trim(s, '/')).join('/')
  }
}

export default class UrlService {
  public baseURL: UrlResolver
  public adminURL: UrlResolver
  public frontendAppURL: UrlResolver
  public mainSiteURL: UrlResolver

  constructor() {
    this.baseURL = new UrlResolver(Env.get('BASE_URL'))
    this.adminURL = new UrlResolver(Env.get('ADMIN_URL'))
    this.frontendAppURL = new UrlResolver(Env.get('FE_APP_URL'))
    this.mainSiteURL = new UrlResolver(Env.get('MAIN_SITE_URL'))
  }

  get(type, path = '') {
    switch (type) {
      case 'baseURL':
      case 'base':
      case 'root':
      case 'main':
      case 'api':
        return this.baseURL.join(path)

      case 'adminURL':
      case 'admin':
      case 'dashboard':
        return this.adminURL.join(path)

      case 'frontendAppURL':
      case 'frontend':
      case 'fe':
      case 'app':
        return this.frontendAppURL.join(path)

      case 'mainSiteURL':
      case 'site':
      case 'website':
        return this.mainSiteURL.join(path)
    }
    return this.mainSiteURL
  }
}
