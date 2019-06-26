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

Route.group(() => {
  Route.any('/', 'Admin/DashboardController.index')

  Route.any('/users/edit/:id', 'Admin/UserController.edit')
  Route.any('/users/delete/:id', 'Admin/UserController.delete')
  Route.any('/users', 'Admin/UserController.index')

  Route.any('/admins/edit/:id', 'Admin/AdminController.edit')
  Route.any('/admins/create', 'Admin/AdminController.create')
  Route.any('/admins/delete/:id', 'Admin/AdminController.delete')
  Route.any('/admins', 'Admin/AdminController.index')
})
  .prefix('/dashboard')
  .middleware(['auth'])

Route.group(() => {
  Route.any('/', 'Admin/AuthController.signin')
}).prefix('/auth')

Route.on('/').render('welcome')
