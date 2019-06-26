'use strict'

const { hooks } = require('@adonisjs/ignitor')
// const testController = use('App/Controllers/Http/Api/MonitorLib')
hooks.after.providersRegistered(async () => {
  const phone = require('phone')
  const Validator = use('Validator')

  // Custome Validator rules
  const mobileCheck = async (data, field, message, args, get) => {
    const value = get(data, field)
    if (!value) {
      return
    }

    let country = ''
    if (args.length) {
      country = args[0]
    }

    const mobileDetect = phone(value, country)

    if (!mobileDetect.length) {
      throw 'number is invalid.'
    }
  }
  Validator.extend('mobile', mobileCheck)

  setTimeout(async () => {
    try {
      const Env = use('Env')
      const mqtt = require('mqtt')

      const secret = Env.get('APP_KEY')
      const mqttAddress = Env.get('MQTT_ADDRESS')

      const User = use('App/Models/User')
      const UserController = use('App/Controllers/Mqtt/UserController')

      // Connect backend to mqtt as server
      global.client = await mqtt.connect('tcp://' + mqttAddress, {
        clientId: secret,
        username: 'server',
        password: 'server',
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        connectTimeout: 5000,
      })
      // Subscribe
      global.client.on('connect', async () => {
        setTimeout(() => {
          global.client.subscribe('api/#', err => {
            if (!err) {
              console.log('Server connected to MQTT ...')
            }
          })
        }, 100)
      })

      // Check message from monitors
      global.client.on('message', async (topic, message, packet) => {
        const msg = message.toString()
        const parsedMsg = JSON.parse(msg)

        const parseTopic = topic.split('/')
        if (parseTopic.length != 2 || parseTopic[0] != 'api') {
          return false
        }

        const user = await User.query('token', parseTopic[1]).first()
        if (!user) {
          return false
        }

        const request = {
          data: parsedMsg,
          user: user,
          callbackTopic: 'callback/' + user.token,
        }

        switch (topic) {
          case 'SET_PROFILE':
            await UserController.setProfile(request)
            break
        }
      })
    } catch (error) {
      console.log(error)
    }
  }, 3000)

  // Create a helper for view
  // const View = use('View');

  // View.global('radnomId', function () {
  //   return Math.floor(Math.random() * 1000);
  // });
})
