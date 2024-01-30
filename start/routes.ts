import Route from '@ioc:Adonis/Core/Route'
import './routes/webRoutes'

const API_PREFIX = '/api/'
// const All_MIDDLEWARE = ['auth:api', 'loadBusiness', 'setBranch', 'acl']

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.group(() => {
  Route.post('/signup', 'Api/AuthController.signup')
  Route.post('/login', 'Api/AuthController.login')
}).prefix(API_PREFIX)

Route.group(() => {
  Route.get('/user', 'Api/AuthController.show')
  Route.put('/user', 'Api/AuthController.update')
  Route.delete('/user', 'Api/AuthController.logout')
})
  .prefix(API_PREFIX)
  .middleware(['auth:api'])
