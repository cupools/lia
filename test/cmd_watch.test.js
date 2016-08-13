/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'

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