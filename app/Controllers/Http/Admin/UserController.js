'use strict'

const { validate } = use('Validator')
const Message = use('App/Libs/Message')
const phone = require('phone')
const User = use('App/Models/User')

class UserController {
  async index({ request, response, view }) {
    if (request.method() == 'GET') {
      const users = await User.all()

      return view.render('users.index', { users: users.toJSON() })
    }
  }

  async edit({ request, response, view, params }) {
    const user = await User.query()
      .where('id', params.id)
      .first()
    if (!user) {
      session.flash({
        errors: ['user not found !'],
      })
      return response.redirect('back')
    }

    if (request.method() == 'GET') {
      return view.render('users.edit', { user })
    }

    const rules = {
      first_name: 'required',
      last_name: 'required',
      email: 'required|email',
      mobile: 'required|mobile',
    }

    const validation = await validate(request.all(), rules)
    if (validation.fails()) {
      session
        .flash({
          errors: Message.normalizeMessages(validation.messages()),
        })
        .flashExcept(['password'])
      return response.redirect('back')
    }

    const mobileNormalize = phone(request.input('mobile'))

    user.first_name = request.input('first_name')
    user.last_name = request.input('last_name')
    user.mobile = mobileNormalize[0]
    user.email = request.input('email')
    await user.save()

    return response.redirect('/dashboard/users')
  }

  async delete({ request, response, view, params }) {
    const user = await User.query()
      .where('id', params.id)
      .first()
    if (!user) {
      session.flash({
        errors: ['user not found !'],
      })
      return response.redirect('back')
    }

    await user.delete()

    return response.redirect('/dashboard/users')
  }
}

module.exports = UserController
