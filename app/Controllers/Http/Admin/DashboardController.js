'use strict'

class DashboardController {
  index({ request, response, view }) {
    return view.render('dashboard.index')
  }
}

module.exports = DashboardController
