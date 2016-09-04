import glob from 'glob'
import path from 'path'
import ejs from 'ejs'
import fs from 'fs-extra'
import image from './utils/image'
import psd from './utils/psd'
import log from './utils/log'

class Lia {
    constructor(options) {
        if (options.psd) {
            let {rewriteOption, rewriteContext} = psd.process(options)
            options = rewriteOption
            this.rewriteContext = rewriteContext
        }

        this.options = Object.assign({
            src: ['*.png'],
            image: 'build/sprite.png',
            style: 'build/sprite.css',
            prefix: '',
            cssPath: './',
            unit: 'px',
            convert: 1,
            decimalPlaces: 6,
            blank: 0,
            padding: 10,
            algorithm: 'binary-tree',
            tmpl: '',
            quiet: false,
            psd: false
        }, options, {
            src: options.src.splice ? options.src : [options.src]
        })

        this.tmpl = this._getTemplate()
        log.state(this.options.quiet)
    }

    run() {
        let sprites = this.getResource()
        let opt = this.options

        if (!sprites.length) {
            log.warn(`No images mapped for \`${opt.src}\``)
            return false
        }

        let result = image.process(sprites, opt)

        if (opt.image) {
            this._buildImage(result)
        } else {
            log.error('`options.image` should not be null')
            return false
        }

        if (opt.style) {
            this._outputStyle(result)
        }

        if (opt.psd) {
            psd.clear()
        }
    }

    _buildImage({image}) {
        let opt = this.options
        let outputPath = path.resolve(opt.image)
        let content = new Buffer(image)

        this.outputImage({
            content,
            outputPath,
            opt
        })
    }

    _outputStyle(result) {
        let opt = this.options
        let outputPath = path.resolve(opt.style)
        let content = ejs.render(this._getTemplate(), this._renderData(result))

        this.outputStyle({
            content,
            outputPath,
            opt
        })
    }

    _renderData({properties, coordinates}) {
        let _options = this.options
        let {blank} = _options

        let width = this._decimal(properties.width)
        let height = this._decimal(properties.height)

        let basename = path.basename(_options.image)
        let p = _options.cssPath + path.basename(_options.image)
        let realpath = path.resolve(_options.image)
        let unit = _options.unit
        let size = {
            width,
            height
        }

        let items = Object.keys(coordinates).map(_realpath => {
            let {x, y, size} = coordinates[_realpath]
            let name = _options.prefix + this._filename(_realpath)
            let width = this._decimal(size.width + blank)
            let height = this._decimal(size.height + blank)
            x = this._decimal(x)
            y = this._decimal(y)

            return {
                name,
                size: {
                    width,
                    height
                },
                x,
                y
            }
        })

        return this.rewriteContext({
            basename,
            path: p,
            realpath,
            unit,
            size,
            items,
            _options
        })
    }

    outputImage({outputPath, content, opt}) {
        fs.outputFileSync(outputPath, content, 'binary')
        log.build(opt.image)
    }

    outputStyle({outputPath, content, opt}) {
        fs.outputFileSync(outputPath, content, 'utf8')
        log.build(opt.style)
    }

    getResource() {
        let sprites = []
        let ignore = path.basename(this.options.image)

        this.options.src.map(reg => {
            sprites.push(...glob.sync(reg))
        })

        return [...new Set(sprites.filter(p => ignore !== path.basename(p)).map(p => path.resolve(p)))]
    }

    rewriteContext(context) {
        return context
    }

    _getTemplate() {
        let tmpl = ''
        let tmplPath = ''
        let opt = this.options
        let defaultPath = path.resolve(__dirname, './tmpl/template.ejs')

        if (opt.tmpl) {
            tmplPath = path.resolve(opt.tmpl)
        } else {
            tmplPath = defaultPath
        }

        try {
            tmpl = fs.readFileSync(tmplPath, 'utf-8')
        } catch (e) {
            log.warn(`\`${opt.tmpl}\` not found.`)
            tmpl = fs.readFileSync(defaultPath, 'utf-8')
        }

        return tmpl
    }

    _filename(p) {
        return path.basename(p).replace(/\.[\w\d]+$/, '')
    }

    _decimal(count) {
        let {decimalPlaces, convert} = this.options
        return (convert && convert !== 1) ? Number((count / convert).toFixed(decimalPlaces)) : count
    }
}

export default Lia
