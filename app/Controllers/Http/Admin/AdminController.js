'use strict'

const Admin = use('App/Models/Admin')
const { validate } = use('Validator')
const Message = use('App/Libs/Message')

const Hash = use('Hash')

class AdminController {
  async index({ request, response, view }) {
    if (request.method() == 'GET') {
      const admins = await Admin.all()

      return view.render('admins.index', { admins: admins.toJSON() })
    }
  }

  async create({ request, response, view, params }) {
    if (request.method() == 'GET') {
      return view.render('admins.create')
    }

    const rules = {
      first_name: 'required',
      last_name: 'required',
      email: 'required|email',
      password: 'required|confirmed',
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

    const admin = new Admin()
    admin.first_name = request.input('first_name')
    admin.last_name = request.input('last_name')
    admin.email = request.input('email')
    admin.password = await Hash.make(request.input('password'))
    await admin.save()

    return response.redirect('/dashboard/admins')
  }

  async edit({ request, response, view, params }) {
    const admin = await Admin.query()
      .where('id', params.id)
      .first()
    if (!admin) {
      session.flash({
        errors: ['admin not found !'],
      })
      return response.redirect('back')
    }
    if (request.method() == 'GET') {
      return view.render('admins.edit', { admin })
    }

    const rules = {
      first_name: 'required',
      last_name: 'required',
      email: 'required|email',
      password: 'confirmed',
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

    admin.first_name = request.input('first_name')
    admin.last_name = request.input('last_name')
    admin.email = request.input('email')

    if (request.input('password')) {
      admin.password = await Hash.make(request.input('password'))
    }
    await admin.save()

    return response.redirect('/dashboard/admins')
  }

  async delete({ request, response, view, params }) {
    const admin = await Admin.query()
      .where('id', params.id)
      .first()
    if (!admin) {
      session.flash({
        errors: ['admin not found !'],
      })
      return response.redirect('back')
    }

    await admin.delete()

    return response.redirect('/dashboard/admins')
  }
}

module.exports = AdminController
