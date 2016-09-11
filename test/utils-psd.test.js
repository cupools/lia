/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'
import images from 'images'
import glob from 'glob'
import path from 'path'

import './css-plugin'

describe('utils - psd', function() {
    before(function() {
        fs.emptyDirSync('test/tmp')
        process.chdir('test/tmp')
    })

    after(function() {
        process.chdir('../..')
    })

    let psd = require('../src/utils/psd').default

    it('should works with group', function() {
        let opt = {
            src: 'group/',
            psd: '../fixtures/keyframes.psd'
        }

        let {_ret, rewriteOption} = psd.process(opt)
        expect(rewriteOption.src).to.contain(path.normalize('/.lia/*'))
        expect(_ret.psd.size.width).to.equal(256)
        expect(_ret.psd.size.height).to.equal(512)
        expect(_ret.items).to.have.lengthOf(4)

        _ret.items.forEach((item, index) => {
            let {output, ...prop} = item
            expect(prop).to.deep.equal({
                name: `${index + 1}`,
                top: 128,
                left: 0,
                right: 256,
                bottom: 384,
                size: {
                    width: 256,
                    height: 256
                }
            })
            expect(images(output).size().width).to.equal(256)
            expect(images(output).size().height).to.equal(256)
        })
    })

    it('should works with layer', function() {
        let opt = {
            src: '{1,2,3}',
            psd: '../fixtures/keyframes.psd'
        }

        let {_ret, rewriteOption} = psd.process(opt)
        expect(rewriteOption.src).to.contain(path.normalize('/.lia/*'))
        expect(_ret.psd.size.width).to.equal(256)
        expect(_ret.psd.size.height).to.equal(512)
        expect(_ret.items).to.have.lengthOf(6)

        let exp = [{
            name: '1',
            top: 128,
            left: 0,
            right: 100,
            bottom: 228,
            size: {
                width: 100,
                height: 100
            }
        }, {
            name: '2',
            top: 128,
            left: 156,
            right: 256,
            bottom: 228,
            size: {
                width: 100,
                height: 100
            }
        }, {
            name: '3',
            top: 284,
            left: 156,
            right: 256,
            bottom: 384,
            size: {
                width: 100,
                height: 100
            }
        }]

        _ret.items.forEach((item, index) => {
            let {output, ...prop} = item
            expect(prop).to.deep.equal(exp[index % 3])
            expect(images(output).size().width).to.equal(100)
            expect(images(output).size().height).to.equal(100)
        })
    })

    it('should works with rewriteContext', function() {
        let opt = {
            src: 'group/',
            psd: '../fixtures/keyframes.psd'
        }

        psd.clear()
        let {rewriteContext} = psd.process(opt)
        let context = {
            items: glob.sync('.lia/*').map(item => ({
                name: item.replace(/\.lia\/([\w\W]+?)\.png/, 'sp-$1')
            }))
        }
        let dest = rewriteContext(context)

        expect(dest.items).to.have.lengthOf(4)
        dest.items.map((item, index) => {
            expect(item.layer).to.deep.equal({
                name: `${index + 1}`,
                top: 128,
                left: 0,
                right: 256,
                bottom: 384,
                size: {
                    width: 256,
                    height: 256
                }
            })
        })
    })

    it('should works with clear', function() {
        let opt = {
            src: '1',
            psd: '../fixtures/keyframes.psd'
        }

        psd.process(opt)
        expect('.lia').to.be.exist
        psd.clear()
        expect('.lia').to.not.be.exist
    })

    it('should works with bad psd', function() {
        let opt = {
            src: ['1'],
            psd: '../fixtures/undefined.psd'
        }

        psd.process(opt)
        expect('.lia').to.not.be.exist
    })

    it('should works with bad layer', function() {
        let opt = {
            src: 'undefined',
            psd: '../fixtures/keyframes.psd'
        }

        psd.process(opt)
        expect('.lia').to.not.be.exist
    })

    it('should works with bad group', function() {
        let opt = {
            src: 'undefined/',
            psd: '../fixtures/keyframes.psd'
        }

        psd.process(opt)
        expect('.lia').to.not.be.exist
    })
})
