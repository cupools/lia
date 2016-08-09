/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'
import child from 'child_process'
import path from 'path'

describe('Main', function() {
    this.timeout(5000)

    describe('call Lia as module', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
        })

        it('should run without exception', function() {
            let Lia = require('../src/lia').default
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                prefix: 'sp',
                cssPath: './',
                unit: 'px',
                convert: 1,
                blank: 0,
                padding: 10,
                algorithm: 'binary-tree',
                tmpl: '',
                wrap: '',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
        })

        it('should build stylesheet successful', function() {
            expect(fs.statSync('test/tmp/sprite.css')).to.be.an('object')
        })

        it('should build sprite pictures successful', function() {
            expect(fs.statSync('test/tmp/sprite.png')).to.be.an('object')
        })
    })

    describe('call Lia via `$lia here`', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
            process.chdir('test/fixtures')
        })

        after(function() {
            fs.remove('sprites-fixtures.png')
            process.chdir('../..')
        })

        it('should run without exception', function() {
            let here = require('../src/cmd/here').default
            expect(here).to.not.throw(Error)
        })

        it('should build sprite pictures successful', function() {
            expect(fs.statSync('sprites-fixtures.png')).to.be.an('object')
        })
    })

    describe('call Lia via `$lia init`', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
        })

        it('should run without exception', function(done) {
            child.exec('node ../../bin/lia init', {
                cwd: path.join(__dirname, 'tmp')
            }, function(error) {
                if (error) {
                    throw error
                }
                done()
            })
        })

        it('should build sprite_conf.js successful', function() {
            expect(fs.statSync('test/tmp/sprite_conf.js')).to.be.an('object')
        })
    })
})
