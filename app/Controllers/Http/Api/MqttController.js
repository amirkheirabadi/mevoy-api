'use strict'

const Env = use('Env')
const { validate } = use('Validator')
const phone = require('phone')

const User = use('App/Models/User')

class MqttController {
  // Check auth for monitors
  async auth({ request, response }) {
    const validation = await validate(request.all(), {
      clientid: 'required',
      username: 'required',
      password: 'required',
    })

    if (validation.fails()) {
      return response.status(400).send()
    }

    const secret = Env.get('APP_KEY')
    if (request.input('clientid') === secret) {
      return true
    }

    const mobileNormalize = phone(request.input('username'))
    const user = await User.query()
      .where('token', request.input('clientid'))
      .where('mobile', mobileNormalize.length ? mobileNormalize[0] : '')
      .first()

    if (!user) {
      return response.status(400).send()
    }

    return response.status(200).send()
  }

  // Check access for monitors
  async acl({ request, response }) {
    const validation = await validate(request.all(), {
      access: 'required',
      username: 'required',
      clientid: 'required',
      ipaddr: 'required',
      topic: 'required',
    })

    if (validation.fails()) {
      return response.status(400).send()
    }

    const secret = Env.get('APP_KEY')
    if (request.input('clientid') === secret) {
      return true
    }

    const user = await User.query()
      .where('token', request.input('clientid'))
      .first()

    if (
      parseInt(request.input('access')) === 1 &&
      request.input('topic') === `callback-${user.token}`
    ) {
      return response.status(200).send()
    }

    if (
      parseInt(request.input('access')) === 2 &&
      request.input('topic') == `api`
    ) {
      return response.status(200).send()
    }

    return response.status(400).send()
  }
}

module.exports = MqttController
