/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'
import './css-plugin'

describe('cmd - lia', function() {
    this.timeout(5000)

    before(function() {
        fs.emptyDirSync('test/tmp')
        process.chdir('test/tmp')
    })

    after(function() {
        process.chdir('../..')
    })

    let main = require('../src/cmd/main').default

    it('should exist without sprite_conf.js', function() {
        expect(main).to.not.throw(Error)
        expect('build/sprite.css').to.not.be.exist
        expect('build/sprite.png').to.not.be.exist
    })

    it('should works', function() {
        fs.copySync('../fixtures', '.')

        expect(main).to.not.throw(Error)
        expect('build/sprite.css').to.be.exist
        expect('build/sprite.png').to.be.exist
    })
})
