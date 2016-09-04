/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'
import './css-plugin'

describe('cmd - lia here', function() {
    before(function() {
        fs.emptyDirSync('test/tmp')
        fs.copySync('test/fixtures', 'test/tmp')
        process.chdir('test/tmp/keyframes')
    })

    after(function() {
        process.chdir('../../..')
    })

    let here = require('../src/cmd/here').default

    it('should works with images', function() {
        expect(here).to.not.throw(Error)
        expect('sprite-keyframes.png').to.be.exist
    })

    it('should works without images', function() {
        fs.emptyDirSync('./')
        expect(here).to.not.throw(Error)
        expect('sprite-keyframes.png').to.not.be.exist
    })
})
