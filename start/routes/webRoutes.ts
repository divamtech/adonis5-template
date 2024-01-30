import Route from '@ioc:Adonis/Core/Route'

// const ADMIN_PREFIX = '/admin'
// const WEBHOOKS = '/webhooks'

//worker route with admin auth
Route.group(() => {
  Route.any('worker', 'ProxyController.proxy')
  Route.any('worker/*', 'ProxyController.proxy')
  Route.any('queue', (ctx) => ctx.response.redirect('/worker'))
  Route.any('queue/*', 'ProxyController.proxy')
  Route.any('api/queues', 'ProxyController.proxy')
  Route.any('api/queues/*', 'ProxyController.proxy')
}) //.middleware(['auth:web']) //FIXME: when admin panel is ready uncomment the auth middleware
