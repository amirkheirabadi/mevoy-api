'use strict'

const { validate } = use('Validator')
const Message = use('App/Libs/Message')

class AuthController {
  async signin({ request, response, view, session, auth }) {
    try {
      if (request.method() == 'GET') {
        return view.render('auth.signin')
      }

      const rules = {
        email: 'required|email',
        password: 'required',
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

      const { email, password } = request.all()
      await auth.attempt(email, password)

      return response.redirect('/dashboard')
    } catch (error) {
      session
        .flash({
          errors: ['email or password is wrong'],
        })
        .flashExcept(['password'])
      return response.redirect('back')
    }
  }

  async signout({ request, response, auth }) {
    await auth.logout()

    response.redirect('/auth')
  }
}

module.exports = AuthController
