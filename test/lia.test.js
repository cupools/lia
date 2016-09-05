/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'
import images from 'images'
import './css-plugin'

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
                decimalPlaces: 6,
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
                background: 'url(\'./sprite.png\') no-repeat'
            })
        })

        it('should works with `image` as \'\'', function() {
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
            expect('build/sprite.png').to.not.be.exist
        })

        it('should works with `style` as false', function() {
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
            expect('build/sprite.css').to.not.be.exist
        })

        it('should works with `prefix` as sprite, .sp', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                prefix: 'sprite, .sp',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.png').to.be.exist
            expect('test/tmp/sprite.css').to.have.selector('.sprite, .sp0')
        })

        it('should works with `cssPath` as ./images/', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                cssPath: './images/',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.png').to.be.exist
            expect('test/tmp/sprite.css').to.have.selector('.0').and.decl({
                background: 'url(\'./images/sprite.png\') no-repeat'
            })
        })

        it('should works with `unit` as rem', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                unit: 'rem',
                convert: 64,
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.png').to.be.exist
            expect('test/tmp/sprite.css').to.have.selector('.0').and.decl({
                width: '4rem'
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

        it('should works with blank as 4', function() {
            let lia = new Lia({
                src: ['test/fixtures/*.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                blank: 4,
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.png').to.be.exist
            expect('test/tmp/sprite.css').to.have.selector('.0').and.decl({
                width: '260px'
            })
        })

        it('should works with padding as 0', function() {
            let lia = new Lia({
                src: ['test/fixtures/{0,1}.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                padding: 0,
                algorithm: 'top-down',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.png').to.be.exist
            expect('test/tmp/sprite.css').to.have.selector('.0').and.decl({
                width: '256px',
                'background-size': '256px 512px'
            })
            expect(images('test/tmp/sprite.png').size().height).to.equal(512)
        })

        it('should works with padding as 8', function() {
            let lia = new Lia({
                src: ['test/fixtures/{0,1}.png'],
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.css',
                padding: 8,
                algorithm: 'top-down',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.png').to.be.exist
            expect('test/tmp/sprite.css').to.have.selector('.0').and.decl({
                width: '256px',
                'background-size': '256px 520px'
            })
            expect(images('test/tmp/sprite.png').size().height).to.equal(520)
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
    })

    describe('call Lia with custom template', function() {
        beforeEach(function() {
            fs.emptyDirSync('test/tmp')
        })

        let Lia = require('../src/lia').default

        it('should works with javascript template', function() {
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

    describe('call Lia with psd', function() {
        beforeEach(function() {
            fs.emptyDirSync('test/tmp')
        })

        let Lia = require('../src/lia').default

        it('should works with javascript template', function() {
            let lia = new Lia({
                src: 'group/',
                image: 'test/tmp/sprite.png',
                style: 'test/tmp/sprite.js',
                tmpl: 'test/fixtures/psd.ejs',
                psd: 'test/fixtures/keyframes.psd',
                quiet: true
            })

            expect(lia.run.bind(lia)).to.not.throw(Error)
            expect('test/tmp/sprite.js').to.be.exist
        })
    })
})
