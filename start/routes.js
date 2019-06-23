'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.any('/auth', 'Api/MqttController.auth')
  Route.any('/acl', 'Api/MqttController.acl')
}).prefix('/mqtt')

Route.group(() => {
  Route.any('/auth', 'Api/AuthController.signin')
  Route.any('/auth/complete', 'Api/AuthController.complete')
  Route.any('/auth/verify', 'Api/AuthController.verify')
  Route.any('/auth/signout', 'Api/AuthController.signout')

  Route.any('/user/profile', 'Api/UserController.profile')
}).prefix('/api')

Route.on('/').render('welcome')
