'use strict'

const { validate } = use('Validator')
const randomstring = require('randomstring')
const Message = use('App/Libs/Message')
const Sms = use('App/Libs/Sms')
const phone = require('phone')

const User = use('App/Models/User')

class UserController {
  static async setProfile({ user, data, callbackTopic }) {
    const rules = {
      first_name: 'required',
      last_name: 'required',
      email: 'required|email',
    }

    const validation = await validate(data, rules)

    if (validation.fails()) {
      return global.client.publish(
        callbackTopic,
        JSON.stringify({
          status: 'failure',
          data: {},
        })
      )
    }

    user.first_name = data.first_name
    user.last_name = data.last_name
    user.email = data.email
    await user.save()

    return global.client.publish(
      callbackTopic,
      JSON.stringify({
        status: 'success',
        data: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        },
      })
    )
  }
}

module.exports = UserController
