/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'

describe('cmd - lia psd', function() {
    before(function() {
        fs.emptyDirSync('test/tmp')
        fs.copySync('test/fixtures/keyframes.psd', 'test/tmp/psd/keyframes.psd')
        fs.copySync('test/fixtures/psd.ejs', 'test/tmp/psd/psd.ejs')
        process.chdir('test/tmp/psd')
    })

    after(function() {
        process.chdir('../../..')
    })

    let psd = require('../src/cmd/psd').default

    it('should works without sprite_conf', function(done) {
        expect(() => psd().then(done)).to.not.throw(Error)
    })

    it('should works', function(done) {
        fs.copySync('../../fixtures/psd_conf.js', 'sprite_conf.js')

        expect(function() {
            psd().then(function() {
                expect('build/sprite.png').to.be.exist
                done()
            })
        }).to.not.throw(Error)
    })
})
