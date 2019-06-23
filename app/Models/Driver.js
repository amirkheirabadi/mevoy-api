'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Driver extends Model {
  static get table() {
    return 'drivers'
  }

  static get primaryKey() {
    return 'id'
  }

  user() {
    return this.hasOne('App/Models/User', 'driver_id', 'id')
  }
}

module.exports = Driver
