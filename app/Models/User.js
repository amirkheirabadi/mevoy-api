'use strict'

const Model = use('Model')

class User extends Model {
  static get table() {
    return 'users'
  }

  static get primaryKey() {
    return 'id'
  }
}

module.exports = User
