/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'

describe('cmd - lia init', function() {
    before(function() {
        fs.emptyDirSync('test/tmp')
        process.chdir('test/tmp')
    })

    after(function() {
        process.chdir('../..')
    })

    it('should run without exception', function() {
        let init = require('../src/cmd/init').default
        expect(init).to.not.throw(Error)
    })

    it('should build sprites_conf', function() {
        expect(fs.statSync('sprite_conf.js')).to.be.an('object')
    })
})
