/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'

describe('cmd - lia', function() {
    before(function() {
        fs.emptyDirSync('test/tmp')
        fs.copySync('test/fixtures', 'test/tmp')
        process.chdir('test/tmp')
    })

    after(function() {
        process.chdir('../..')
    })

    it('should run without exception', function() {
        let main = require('../src/cmd/main').default
        expect(main).to.not.throw(Error)
    })

    it('should build stylesheet successful', function() {
        expect(fs.statSync('build/sprite.css')).to.be.an('object')
    })

    it('should build sprite pictures successful', function() {
        expect(fs.statSync('build/sprite.png')).to.be.an('object')
    })

    it('should log warn without sprite_conf', function() {
        process.chdir('../')
        let main = require('../src/cmd/main').default
        expect(main).to.not.throw(Error)
        process.chdir('tmp')
    })
})
