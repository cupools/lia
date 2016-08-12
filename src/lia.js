import glob from 'glob'
import path from 'path'
import ejs from 'ejs'
import fs from 'fs-extra'
import image from './utils/image'
import log from './utils/log'

class Lia {
    constructor(options) {
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
            quiet: false
        }, options)

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
    }

    _buildImage({image}) {
        let opt = this.options
        let outputPath = this._realpath(opt.image)
        let content = new Buffer(image)

        this.outputImage({
            content,
            outputPath,
            opt
        })
    }

    _outputStyle(result) {
        let opt = this.options
        let outputPath = this._realpath(opt.style)
        let content = ejs.render(this._getTemplate(), this._renderData(result))

        this.outputStyle({
            content,
            outputPath,
            opt
        })
    }

    _renderData({properties, coordinates}) {
        let _options = this.options

        let width = this._decimal(properties.width)
        let height = this._decimal(properties.height)

        let basename = path.basename(_options.image)
        let p = _options.cssPath + path.basename(_options.image)
        let realpath = this._realpath(_options.image)
        let unit = _options.unit
        let size = {
            width,
            height
        }

        let items = Object.keys(coordinates).map(realpath => {
            let {x, y, size} = coordinates[realpath]
            let name = _options.prefix + this._filename(realpath)
            let width = this._decimal(size[width])
            let height = this._decimal(size[height])

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

        return {
            basename,
            path: p,
            realpath,
            unit,
            size,
            items,
            _options
        }
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

        return [...new Set(sprites.filter(p => ignore !== path.basename(p)).map(p => this._realpath(p)))]
    }

    _getTemplate() {
        let tmpl = ''
        let tmplPath = ''
        let opt = this.options
        let defaultPath = path.resolve(__dirname, './tmpl/template.ejs')

        if (opt.tmpl) {
            tmplPath = path.resolve(process.cwd(), opt.tmpl)
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

    _realpath(...p) {
        return path.resolve.apply(null, [process.cwd(), ...p])
    }

    _filename(p) {
        return path.basename(p).replace(/\.[\w\d]+$/, '')
    }

    _decimal(count) {
        let {decimalPlaces, convert} = this.options
        return convert ? Number((count / convert).toFixed(decimalPlaces)) : count
    }

}

export default Lia
