import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import httpProxy from 'http-proxy'
import Logger from '@ioc:Adonis/Core/Logger'
import Env from '@ioc:Adonis/Core/Env'

export default class ProxyController {
  /**
   * Proxy any request to the targeted PROXY_HOST
   *
   * @param {import('@adonisjs/framework/src/Request')} request
   * @param {import('@adonisjs/framework/src/Response')} response
   * @return {Promise}
   */
  async proxy({ request, response }: HttpContextContract) {
    // return response.send('hello')
    Logger.info('requested url: %s', request.url())
    const proxy = httpProxy.createProxyServer()

    // Create proxy promise, so we can await the body of the proxy response
    const prom = new Promise((resolve, reject) => {
      Logger.info('Creating proxy promise for %s', request.url())
      // Setup request listener, resolve body to return
      proxy.on('proxyRes', (proxyRes, req, res) => {
        let body: any = []
        proxyRes.on('data', function (chunk) {
          body.push(chunk)
        })
        proxyRes.on('end', function () {
          body = Buffer.concat(body).toString()
          resolve(body)
        })
      })

      // Forward the post body, do not mutate the body as request headers will be wrong
      // and cannot be set here
      if (['POST', 'PUT', 'post', 'put'].includes(request.method())) {
        // request.request.body = request.raw()
        proxy.on('proxyReq', (proxyReq, req, res, options) => {
          if (req.body) {
            proxyReq.write(req.body)
          }
        })
      }

      // Proxy the request, remember to use native request and response objects
      const req = request.request
      req.url = req.url?.replace('/worker', '')
      proxy.web(
        req,
        response.response,
        {
          target: `http://localhost:${Env.get('BULL_SERVER_PORT', 9999)}`,
        },
        (e) => {
          Logger.info('Proxy error', e)
          reject(e)
        }
      )
    })

    const result = await prom
    response.send(result)

    return response
  }
}
