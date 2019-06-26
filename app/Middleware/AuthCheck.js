'use strict'

// Auth Check

const View = use('View')
// const Account = use('App/Models/Account')

class AuthCheck {
  async handle({ request, auth, response, view, session }, next, params) {
    try {
      await auth.check()

      request.user = await auth.getUser()

      view.share({
        auth: {
          user: request.user,
        },
      })
    } catch (error) {
      return response.redirect('/auth')
    }

    await next()
  }
}

module.exports = AuthCheck
