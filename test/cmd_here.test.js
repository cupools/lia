/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'

describe('cmd - lia here', function() {
    before(function() {
        fs.emptyDirSync('test/tmp')
        fs.copySync('test/fixtures', 'test/tmp')
        process.chdir('test/tmp/keyframes')
    })

    after(function() {
        process.chdir('../../..')
    })

    it('should run without exception', function() {
        let here = require('../src/cmd/here').default
        expect(here).to.not.throw(Error)
    })

    it('should build sprite pictures successful', function() {
        expect(fs.statSync('sprites-keyframes.png')).to.be.an('object')
    })
})
