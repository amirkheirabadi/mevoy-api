'use strict'

const Model = use('Model')

class User extends Model {
  static get table() {
    return 'users'
  }

  static get primaryKey() {
    return 'id'
  }

  driver() {
    return this.hasOne('App/Models/Driver', 'id', 'driver_id')
  }
}

module.exports = User
