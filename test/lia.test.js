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

        it('should run without exception with convert as 2', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                convert: 2,
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
        })

        it('should run without exception with convert as 0', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                convert: 0,
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
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

        it('should not output stylesheet across sprite_conf', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: false,
                prefix: 'sp',
                cssPath: './',
                unit: 'rem',
                convert: 2,
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect(fs.statSync.bind(fs, 'sprite.css')).to.throw(Error)
        })

        it('should return false when miss `option.image`', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: '',
                style: 'test/tmp/sprite.css',
                cssPath: './',
                unit: 'rem',
                convert: 2,
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect(fs.statSync.bind(fs, 'sprite.css')).to.throw(Error)
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
})
