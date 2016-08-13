/* eslint-env mocha */

import { expect } from 'chai'

describe('cmd - lia help', function() {
    it('should run without exception', function() {
        let help = require('../src/cmd/help').default
        expect(help).to.not.throw(Error)
    })
})
