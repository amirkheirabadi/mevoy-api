'use strict'

// Auth Check

const View = use('View')
// const Account = use('App/Models/Account')

class AuthCheck {
  async handle({ request, auth, response, view, session }, next, params) {
    let authenticator
    try {
      // Check login user as user
      authenticator = auth.authenticator('user')
      await authenticator.check()

      const user = await authenticator.getUser()
      const accountsCount = await Account.query()
        .where('user_id', user.id)
        .count()

      request.accountManager = !!accountsCount[0]['count(*)']
      request.role = 'user'
    } catch (error) {
      // Check login user as admin
      try {
        authenticator = auth.authenticator('admin')
        await authenticator.check()

        request.role = 'admin'
      } catch (error) {
        if (params[0] !== undefined && params[0]) {
          return await next()
        }
        return response.redirect('/auth')
      }
    }

    // check loggined user status
    if (authenticator.user.status !== 'active') {
      await authenticator.logout()

      if (params[0] !== undefined && params[0]) {
        request.user = authenticator.user
        return await next()
      }
      return response.redirect('/auth')
    }

    request.user = authenticator.user

    view.share({
      auth: {
        user: await authenticator.user,
      },
    })

    await next()
  }
}

module.exports = AuthCheck
