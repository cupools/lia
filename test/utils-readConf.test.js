/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'

describe('utils - readConf', function() {
    before(function() {
        fs.emptyDirSync('test/tmp')
        process.chdir('test/tmp')
    })

    after(function() {
        process.chdir('../..')
    })

    let readConf = require('../src/utils/readConf').default

    it('should works with undefined config', function() {
        fs.mkdirSync('undefined')
        process.chdir('undefined')

        let config = readConf()
        expect(config).to.be.an('array')
        expect(config).to.be.lengthOf(0)

        process.chdir('..')
    })

    it('should works with syntax error config', function() {
        fs.copySync('../fixtures/syntax_error_conf.js', 'error/sprite_conf.js')
        process.chdir('error')

        let config = readConf()
        expect(config).to.be.an('array')
        expect(config).to.be.lengthOf(0)

        process.chdir('..')
    })

    it('should works', function() {
        fs.copySync('../fixtures/sprite_conf.js', 'sprite_conf.js')

        let config = readConf()
        expect(config).to.be.an('array')
        expect(config).to.be.lengthOf(1)
    })
})
