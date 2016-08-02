/* eslint-env mocha */

'use strict'

let assert = require('assert')
let fs = require('fs-extra')
let path = require('path')
let child = require('child_process')

let Lia = require('../main.js')

describe('Different Options', function() {
    this.timeout(5000)

    describe('module', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
        })

        it('run', function() {
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
            }, 'should run without exception')
        })

        it('build stylesheet', function() {
            assert.doesNotThrow(function() {
                fs.statSync('test/tmp/sprite.css')
            }, 'should output stylesheet file')
        })

        it('build sprite pictures', function() {
            assert.doesNotThrow(function() {
                fs.statSync('test/tmp/sprite.png')
            }, 'should output sprite file')
        })
    })

    describe('$lia here', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
        })

        after(function() {
            fs.remove('test/fixtures/sprites-fixtures.png')
        })

        it('run', function() {
            assert.doesNotThrow(function() {
                let ret = child.spawnSync('node', ['../../bin/lia', 'here'], {
                    cwd: path.join(__dirname, 'fixtures'),
                    encoding: 'utf8'
                })
                if (ret.stderr) {
                    throw Error(ret.stderr)
                }
            }, 'should run without exception')
        })

        it('build sprite pictures', function() {
            assert.doesNotThrow(function() {
                fs.statSync('test/fixtures/sprites-fixtures.png')
            }, 'should output sprite file')
        })
    })

    describe('$lia init', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
        })

        it('run', function() {
            assert.doesNotThrow(function() {
                let ret = child.spawnSync('node', ['../../bin/lia', 'init'], {
                    cwd: path.join(__dirname, 'tmp'),
                    encoding: 'utf8'
                })
                if (ret.stderr) {
                    throw Error(ret.stderr)
                }
            }, 'should run without exception')
        })

        it('build sprite_conf.js', function() {
            assert.doesNotThrow(function() {
                fs.statSync('test/tmp/sprite_conf.js')
            }, 'should output sprite_conf.js')
        })
    })
})
