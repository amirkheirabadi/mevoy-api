const Twilio = require('twilio')
const Env = use('Env')

class Sms {
  static async send(number, message) {
    try {
      const client = Twilio(
        Env.get('TWILIO_ACCOUNT_SID'),
        Env.get('TWILIO_TOKEN')
      )

      const info = await client.messages.create({
        body: message,
        from: Env.get('TWILIO_CALLER_NUMBER'),
        to: number,
      })

      return info
    } catch (error) {
      console.log(error)
    }
  }
}
module.exports = Sms