/* eslint-env mocha */

import { expect } from 'chai'
import fs from 'fs-extra'
import images from 'images'

describe('cmd - lia psd', function() {
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
            psd: '../fixtures/keyframes.psd',
            image: 'build/sprite.png',
            style: 'build/sprite.js',
            padding: 0,
            algorithm: 'left-right',
            tmpl: 'psd.ejs',
            quiet: false
        }

        let {_ret, rewriteOption} = psd.process(opt)
        expect(_ret.psd.size.width).to.equal(256)
        expect(_ret.psd.size.height).to.equal(512)

        let {output, ...prop} = _ret.items[1]
        expect(prop).to.deep.equal({
            name: '2',
            top: 128,
            left: 0,
            right: 256,
            bottom: 384,
            size: {
                width: 256,
                height: 256
            }
        })
        expect(rewriteOption.src).to.contain('/.lia/*')
        expect(images(output).size().width).to.equal(256)
        expect(images(output).size().height).to.equal(256)
    })
})
