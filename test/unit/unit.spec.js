/*
 * @Descripttion:
 * @Author: zenghua.wang
 * @Date: 2019-05-15 21:07:19
 * @LastEditors: zenghua.wang
 * @LastEditTime: 2021-12-02 10:56:51
 */
'use strict'

const { ServiceBroker } = require('moleculer')
const { ValidationError } = require('moleculer').Errors
const TestService = require('../../examples/unit.service')

describe("Test 'unit' service", () => {
  let broker = new ServiceBroker({ logger: false })
  broker.createService(TestService)

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  describe("Test 'unit.hello' action", () => {
    it("should return with 'Hello Moleculer'", () => {
      expect(broker.call('unit.hello')).resolves.toBe('Hello Moleculer')
    })
  })

  describe("Test 'unit.welcome' action", () => {
    it("should return with 'Welcome'", () => {
      expect(broker.call('unit.welcome', { name: 'Adam' })).resolves.toBe('Welcome, Adam')
    })

    it('should reject an ValidationError', () => {
      expect(broker.call('unit.welcome')).rejects.toBeInstanceOf(ValidationError)
    })
  })
})
