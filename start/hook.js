'use strict'

const { hooks } = require('@adonisjs/ignitor')
const phone = require('phone')
const Validator = use('Validator')

const testController = use('App/Controllers/Http/Api/MonitorLib')

hooks.after.providersRegistered(async () => {
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
      throw message
    }
  }
  Validator.extend('mobile', mobileCheck)

  setTimeout(async () => {
    try {
      const Env = use('Env')
      const mqtt = require('mqtt')

      const secret = Env.get('APP_KEY')
      const mqttAddress = Env.get('MQTT_ADDRESS')

      // Connect backend to mqtt as server
      global.client = await mqtt.connect('tcp://' + mqttAddress, {
        clientId: secret,
        username: 'test',
        password: 'test',
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        connectTimeout: 5000,
      })

      // Subscribe
      global.client.on('connect', async () => {
        console.log('Server connected to MQTT ...')
        global.client.subscribe('api')
      })

      // Check message from monitors
      global.client.on('message', async (topic, message) => {
        const msg = message.toString()
        const parsedMsg = JSON.parse(msg)

        // Call function for each operation
        switch (topic) {
          case 'test':
            // testController.getCurrentBook(parsedMsg.monitor)
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
