'use strict'

const { validate } = use('Validator')
const randomstring = require('randomstring')
const Message = use('App/Libs/Message')
const Sms = use('App/Libs/Sms')
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
        messages: Message.normalizeMessages(validation.messages()),
        data: {},
      })
    }

    const mobileNormalize = phone(request.input('mobile'))
    let user = await User.query()
      .where('mobile', mobileNormalize[0])
      .first()
    if (!user) {
      user = new User()
      user.mobile = mobileNormalize[0]
      user.status = 'pending'
    }

    const verifyCode = randomstring.generate({
      length: 5,
      charset: 'numeric',
    })
    user.verify_code = verifyCode
    await user.save()

    // Sms.send(user.mobile, `verification code is ${user.verify_code}`)

    return response.send({
      messages: [],
      data: {},
    })
  }

  async complete({ request, response }) {
    const rules = {
      first_name: 'required',
      last_name: 'required',
      mobile: 'required|mobile',
      email: 'required|email',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).send({
        messages: Message.normalizeMessages(validation.messages()),
        data: {},
      })
    }
    const mobileNormalize = phone(request.input('mobile'))

    let user = await User.query()
      .where('mobile', mobileNormalize[0])
      .where('status', 'pending')
      .first()

    if (!user) {
      return response.status(400).send({
        messages: ['user is not exists'],
        status: [],
      })
    }

    user.first_name = request.input('first_name')
    user.last_name = request.input('last_name')
    user.email = request.input('email')
    user.status = 'active'

    const verifyCode = randomstring.generate({
      length: 5,
      charset: 'numeric',
    })
    user.verify_code = verifyCode
    await user.save()

    // Sms.send(user.mobile, `verification code is ${user.verify_code}`)

    return response.send({
      messages: [],
      data: {},
    })
  }

  async verify({ request, response }) {
    const rules = {
      mobile: 'required|mobile',
      code: 'required',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).send({
        messages: Message.normalizeMessages(validation.messages()),
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

    if (user.verify_code != request.input('code')) {
      return response.status(400).send({
        messages: ['verify code is wrong'],
        data: {},
      })
    }

    user.token = randomstring.generate({
      length: 15,
      charset: 'alphanumeric',
    })

    await user.save()

    return response.send({
      messages: [],
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile,
        token: user.token,
        status: user.status,
      },
    })
  }

  async signout({ request, response }) {
    const rules = {
      mobile: 'required|mobile',
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).send({
        messages: Message.normalizeMessages(validation.messages()),
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
