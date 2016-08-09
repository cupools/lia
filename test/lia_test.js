/* eslint-env mocha */

'use strict'

let assert = require('assert')
let fs = require('fs-extra')
let child = require('child_process')
let path = require('path')
let Lia = require('../main.js')

describe('Main', function() {
    this.timeout(5000)

    describe('call Lia as module', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
        })

        it('should run without exception', function() {
            assert.doesNotThrow(function() {
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
                lia.run()
            })
        })

        it('should build stylesheet successful', function() {
            assert.doesNotThrow(function() {
                fs.statSync('test/tmp/sprite.css')
            })
        })

        it('should build sprite pictures successful', function() {
            assert.doesNotThrow(function() {
                fs.statSync('test/tmp/sprite.png')
            })
        })
    })

    describe('call Lia via `$lia here`', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
        })

        after(function() {
            fs.remove('test/fixtures/sprites-fixtures.png')
        })

        it('should run without exception', function(done) {
            child.exec('node ../../bin/lia here', {
                cwd: path.join(__dirname, 'fixtures')
            }, function(error, stdout) {
                if (error) {
                    throw error
                }
                done()
            })
        })

        it('should build sprite pictures successful', function() {
            assert.doesNotThrow(function() {
                fs.statSync('test/fixtures/sprites-fixtures.png')
            })
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
            assert.doesNotThrow(function() {
                fs.statSync('test/tmp/sprite_conf.js')
            })
        })
    })
})
