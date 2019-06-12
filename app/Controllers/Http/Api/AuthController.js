'use strict'

const { validate } = use('Validator')
const randomstring = require('randomstring')
const Messages = use('App/Utils/Messages')
const Sms = use('App/Utils/Sms')
const phone = require('phone')

const User = use('App/Models/User')

class AuthController {
  async signin({ request, response }) {
    const rules = {
      mobile: 'required|mobile',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).send({
        messages: Messages.normalizeMessages(validation.messages()),
        data: {},
      })
    }

    const mobileNormalize = phone(request.input('mobile'))
    const user = await User.query()
      .where('mobile', mobileNormalize[0])
      .first()
    if (!user) {
      return response.status(404).send({
        messages: ['user not found'],
        data: {},
      })
    }

    if (user.verify != 'yes') {
      return response.status(400).send({
        messages: ['user is not verify'],
        data: {},
      })
    }

    const verifyCode = randomstring.generate({
      length: 5,
      charset: 'numeric',
    })
    user.verify_code = verifyCode
    await user.save()

    Sms.send(user.mobile, `verification code is ${user.verify_code}`)

    return response.send({
      messages: [],
      data: {},
    })
  }

  async signup({ request, response }) {
    const rules = {
      first_name: 'required',
      last_name: 'required',
      mobile: 'required|mobile',
      email: 'required|email',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).send({
        messages: Messages.normalizeMessages(validation.messages()),
        data: {},
      })
    }
    const mobileNormalize = phone(request.input('mobile'))

    let user = await User.query()
      .where('mobile', mobileNormalize[0])
      .first()
    if (user) {
      if (user.verify == 'yes') {
        return response.status(400).send({
          messages: ['user is currently active'],
          status: [],
        })
      }
    } else {
      user = new User()

      user.first_name = request.input('first_name')
      user.last_name = request.input('last_name')
      user.email = request.input('email')
      user.verify = 'no'
      user.mobile = mobileNormalize[0]
    }

    const verifyCode = randomstring.generate({
      length: 5,
      charset: 'numeric',
    })
    user.verify_code = verifyCode
    await user.save()

    Sms.send(user.mobile, `verification code is ${user.verify_code}`)

    return response.send({
      messages: [],
      data: {},
    })
  }

  async verify({ request, response }) {
    const rules = {
      mobile: 'required|mobile',
      verify: 'required',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).send({
        messages: Messages.normalizeMessages(validation.messages()),
        data: {},
      })
    }
    const mobileNormalize = phone(request.input('mobile'))

    const user = await User.query()
      .where('mobile', mobileNormalize[0])
      .first()

    if (!user) {
      return response.status(404).send({
        messages: ['user not found'],
        data: {},
      })
    }

    if (user.verify == 'yes') {
      user.token = randomstring.generate({
        length: 15,
        charset: 'alphanumeric',
      })

      await user.save()
      return response.send({
        messages: [],
        data: {
          token: user.token,
        },
      })
    }

    if (user.verify_code != request.input('verify')) {
      return response.status(400).send({
        messages: ['verify code is wrong'],
        data: {},
      })
    }

    user.verify = 'yes'
    await user.save()

    return response.send({
      messages: [],
      data: {},
    })
  }

  async signout({ request, response }) {
    const rules = {
      mobile: 'required|mobile',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).send({
        messages: Messages.normalizeMessages(validation.messages()),
        data: {},
      })
    }
    const mobileNormalize = phone(request.input('mobile'))

    const user = await User.query()
      .where('mobile', mobileNormalize[0])
      .first()

    if (user) {
      user.token = ''
      await user.save()
    }

    return response.send({
      messages: [],
      data: {},
    })
  }
}

module.exports = AuthController
