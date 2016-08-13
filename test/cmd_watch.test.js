/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'
import './css-plugin'

describe('cmd - lia watch', function() {
    this.timeout(5000)

    before(function() {
        fs.emptyDirSync('test/tmp')
        fs.copySync('test/fixtures', 'test/tmp')
        process.chdir('test/tmp')
    })

    after(function() {
        process.chdir('../..')
    })

    let watch = require('../src/cmd/watch').default
    let watcher, last

    it('should works', function(done) {
        expect(function() {
            watcher = watch()
            watcher.on('ready', () => done())
        }).to.not.throw(Error)
    })

    it('should build resources successful', function(done) {
        setTimeout(function() {
            last = fs.statSync('build/sprite.png')

            expect('build/sprite.png').to.be.exist
            expect('build/sprite.css').to.be.exist
            expect('build/sprite.css').to.have.selector('.0')

            done()
        }, 1000)
    })

    it('should trigger rebuild when remove file', function(done) {
        fs.removeSync('0.png')

        setTimeout(function() {
            let current = fs.statSync('build/sprite.png')

            expect(current.ctime.toString()).to.not.equal(last.ctime.toString())

            expect('build/sprite.css').to.not.have.selector('.0')
            expect('build/sprite.css').to.have.selector('.2').and.decl({
                width: '50px'
            })

            last = current
            done()
        }, 2000)
    })

    it('should trigger rebuild when add file', function(done) {
        fs.copySync('../fixtures/1.png', '2.png')

        setTimeout(function() {
            let current = fs.statSync('build/sprite.png')

            expect(current.ctime.toString()).to.not.equal(last.ctime.toString())

            expect('build/sprite.css').to.have.selector('.2').and.decl({
                width: '128px'
            })

            last = current
            done()
        }, 4000)
    })

    it('should not trigger rebuild when add extract file', function(done) {
        fs.copySync('../fixtures/1.png', 'extra/2.png')

        setTimeout(function() {
            let current = fs.statSync('build/sprite.png')

            expect(current.ctime.toString()).to.equal(last.ctime.toString())

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
            watcher = watch()
        }).to.not.throw(Error)

        process.chdir('tmp')
    })
})
