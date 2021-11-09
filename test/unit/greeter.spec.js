/*
 * @Descripttion:
 * @Author: zenghua.wang
 * @Date: 2019-05-15 21:07:19
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-11-09 09:58:45
 */
'use strict'

const { ServiceBroker } = require('moleculer')
const { ValidationError } = require('moleculer').Errors
const TestService = require('../../services/greeter.service')

describe("Test 'greeter' service", () => {
  let broker = new ServiceBroker({ logger: false })
  broker.createService(TestService)

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  describe("Test 'greeter.hello' action", () => {
    it("should return with 'Hello Moleculer'", () => {
      expect(broker.call('greeter.hello')).resolves.toBe('Hello Moleculer')
    })
  })

  describe("Test 'greeter.welcome' action", () => {
    it("should return with 'Welcome'", () => {
      expect(broker.call('greeter.welcome', { name: 'Adam' })).resolves.toBe('Welcome, Adam')
    })

    it('should reject an ValidationError', () => {
      expect(broker.call('greeter.welcome')).rejects.toBeInstanceOf(ValidationError)
    })
  })
})
