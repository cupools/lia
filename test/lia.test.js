/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'

describe('Main', function() {
    this.timeout(5000)

    describe('call Lia as module', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
        })

        let Lia = require('../src/lia').default

        it('should run without exception', function() {
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
                algorithm: 'left-right',
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

        it('should warn and exist when finds no images', function() {
            let lia = new Lia({
                src: ['test/fixtures/extra/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
        })

        it('should not output images across sprite_conf', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: false,
                style: 'test/tmp/sprite.css',
                prefix: 'sp',
                cssPath: './',
                unit: 'rem',
                convert: 2,
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect(fs.statSync.bind(fs, 'sprite.png')).to.throw(Error)
        })
    })

    describe('call Lia with custom template', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
        })

        let Lia = require('../src/lia').default

        it('should output .js successful', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.js',
                tmpl: 'test/fixtures/sprite.tmpl',
                wrap: 'module.export=[${content}]',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect(fs.statSync('test/tmp/sprite.js')).to.be.an('object')
        })

        it('should output successful whithout `tmpl`', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                tmpl: 'test/fixtures/undefined.tmpl',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect(fs.statSync('test/tmp/sprite.css')).to.be.an('object')
        })
    })

    describe('call Lia via `$lia`', function() {
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

    describe('call Lia via `$lia init`', function() {
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

    describe('call Lia via `$lia here`', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
            process.chdir('test/fixtures')
        })

        after(function() {
            process.chdir('../..')
            fs.remove('test/fixtures/sprites-fixtures.png')
        })

        it('should run without exception', function() {
            let here = require('../src/cmd/here').default
            expect(here).to.not.throw(Error)
        })

        it('should build sprite pictures successful', function() {
            expect(fs.statSync('sprites-fixtures.png')).to.be.an('object')
        })
    })

    describe('call Lia via `$lia help`', function() {
        it('should run without exception', function() {
            let help = require('../src/cmd/help').default
            expect(help).to.not.throw(Error)
        })
    })

    describe('call Lia via `$lia watch`', function() {
        before(function() {
            fs.emptyDirSync('test/tmp')
            fs.copySync('test/fixtures', 'test/tmp')
            process.chdir('test/tmp')
        })

        after(function() {
            process.chdir('../..')
        })

        let watcher
        let last

        it('should run without exception', function() {
            expect(function() {
                watcher = require('../src/cmd/watch').default()
            }).to.not.throw(Error)
        })

        it('should build resources successful', function(done) {
            setTimeout(function() {
                last = fs.statSync('build/sprite.png')

                expect(last).to.be.an('object')
                expect(fs.statSync('build/sprite.css')).to.be.an('object')

                done()
            }, 2000)
        })

        it('should trigger rebuild when remove file', function(done) {
            fs.removeSync('1.png')

            setTimeout(function() {
                let current = fs.statSync('build/sprite.png')
                expect(current).to.be.an('object')
                expect(current).to.not.equal(last)
                expect(fs.statSync('build/sprite.css')).to.be.an('object')

                last = current
                done()
            }, 2000)
        })

        it('should trigger rebuild when add file', function(done) {
            fs.copySync('../fixtures/1.png', '2.png')

            setTimeout(function() {
                let current = fs.statSync('build/sprite.png')
                expect(current).to.be.an('object')
                expect(current.ctime).to.not.equal(last.ctime)
                expect(fs.statSync('build/sprite.css')).to.be.an('object')

                last = current
                done()
            }, 4000)
        })

        it('should not trigger rebuild when add extract file', function(done) {
            fs.copySync('../fixtures/1.png', 'extra/2.png')

            setTimeout(function() {
                let current = fs.statSync('build/sprite.png')
                expect(current).to.be.an('object')
                expect(current.ctime.toString()).to.equal(last.ctime.toString())
                expect(fs.statSync('build/sprite.css')).to.be.an('object')

                done()
            }, 4000)
        })

        it('should close successful', function() {
            watcher.close()
            expect(watcher.close.bind(watcher)).to.not.throw(Error)
        })

        it('should warn and exist without sprite_conf', function() {
            process.chdir('..')

            expect(function() {
                watcher = require('../src/cmd/watch').default()
            }).to.not.throw(Error)

            process.chdir('tmp')
        })
    })
})
