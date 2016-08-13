/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'
import './css-plugin'

describe('cmd - lia init', function() {
    before(function() {
        fs.emptyDirSync('test/tmp')
        process.chdir('test/tmp')
    })

    after(function() {
        process.chdir('../..')
    })

    it('should works', function() {
        let init = require('../src/cmd/init').default
        expect(init).to.not.throw(Error)
        expect('sprite_conf.js').to.be.exist
    })
})
