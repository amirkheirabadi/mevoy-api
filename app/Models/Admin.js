'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Admin extends Model {
  static get table() {
    return 'admins'
  }

  static get primaryKey() {
    return 'id'
  }
}

module.exports = Admin
