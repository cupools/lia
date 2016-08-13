/* eslint-env mocha */

import chai from 'chai'
import fs from 'fs-extra'
import './css-plugin'

const {expect} = chai

describe('Main', function() {
    describe('call Lia as module', function() {
        beforeEach(function() {
            fs.emptyDirSync('test/tmp')
        })

        let Lia = require('../src/lia').default

        it('should works with default options', function() {
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
            expect('test/tmp/sprite.png').to.be.exist
            expect('test/tmp/sprite.css').to.have.selector('.sp0').and.decl({
                width: '256px',
                background: 'url(./sprite.png) no-repeat'
            })
        })

        it('should works with `convert` as 0', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                convert: 0,
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.png').to.be.exist
            expect('test/tmp/sprite.css').to.have.selector('.0').and.decl({
                width: '256px'
            })
        })

        it('should works with `convert` as 2', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                convert: 2,
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.png').to.be.exist
            expect('test/tmp/sprite.css').to.have.selector('.0').and.decl({
                width: '128px'
            })
        })

        it('should works with `convert` as 3 and `decimalPlaces` as 2', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                convert: 3,
                decimalPlaces: 2,
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.png').to.be.exist
            expect('test/tmp/sprite.css').to.have.selector('.0').and.decl({
                width: '85.33px'
            })
        })

        it('should exist when finds no images', function() {
            let lia = new Lia({
                src: ['test/fixtures/extra/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.png').to.not.be.exist
            expect('test/tmp/sprite.css').to.not.be.exist
        })

        it('should not output stylesheet with `style` as false', function() {
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
            expect('build/sprite.css').to.not.be.exsit
        })

        it('should do nothing with `image` as \'\'', function() {
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
            expect('build/sprite.png').to.not.be.exsit
        })
    })

    describe('call Lia with custom template', function() {
        beforeEach(function() {
            fs.emptyDirSync('test/tmp')
        })

        let Lia = require('../src/lia').default

        it('should output template successful', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.js',
                tmpl: 'test/fixtures/template.ejs',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.js').to.be.exist
        })

        it('should works whithout `tmpl`', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                tmpl: 'test/fixtures/undefined.tmpl',
                prefix: 'sp',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.css').to.be.exist
        })
    })
})
