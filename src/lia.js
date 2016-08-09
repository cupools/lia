import glob from 'glob'
import path from 'path'
import fs from 'fs-extra'
import template from 'es6-template-strings'
import image from './utils/image'
import log from './utils/log'

class Lia {
    constructor(options) {
        this.options = Object.assign({
            src: ['**/sprite-*.png'],
            image: 'build/sprite.png',
            style: 'build/sprite.css',
            prefix: '',
            cssPath: './',
            unit: 'px',
            convert: 1,
            blank: 0,
            padding: 10,
            algorithm: 'binary-tree',
            tmpl: '',
            wrap: '',
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
        }
        if (opt.style) {
            this._outputStyle(result)
        }
    }

    _buildImage({image}) {
        let opt = this.options
        let outputPath = this._resolvePath(opt.image)
        let content = new Buffer(image)

        this.outputImage({
            content,
            outputPath,
            opt
        })
    }

    _outputStyle({coordinates, properties}) {
        let store = []
        let opt = this.options
        let outputPath = this._resolvePath(opt.style)
        let totalWidth = properties.width
        let totalHeight = properties.height

        Object.keys(coordinates).map(originPath => {
            let payload = coordinates[originPath]
            store.push(this._render(originPath, payload, {
                totalWidth,
                totalHeight
            }))
        })

        let content = store.join('')
        let wrap = opt.wrap

        if (wrap) {
            let imageName = this._basename(opt.image)
            content = template(wrap, {
                content,
                totalWidth,
                totalHeight,
                imageName
            })
        }

        this.outputStyle({
            content,
            outputPath,
            opt
        })
    }

    outputImage({outputPath, content, opt}) {
        try {
            fs.outputFileSync(outputPath, content, 'binary')
            log.build(opt.image)
        } catch (e) {
            log.error(e.message)
        }
    }

    outputStyle({outputPath, content, opt}) {
        try {
            fs.outputFileSync(outputPath, content, 'utf8')
            log.build(opt.style)
        } catch (e) {
            log.error(e.message)
        }
    }

    _render(originPath, {width, height, x, y}, {totalWidth, totalHeight}) {
        let {unit, convert, cssPath, image, blank} = this.options
        let imageName = this._basename(image)
        let name = this._name(originPath)
        let selector = this.options.prefix + name

        if (convert !== 1) {
            width = (width + blank) / convert
            height = (height + blank) / convert
            totalWidth = totalWidth / convert
            totalHeight = totalHeight / convert
            x = x / convert
            y = y / convert
        }

        let data = {
            name,
            imageName,
            totalWidth,
            width,
            totalHeight,
            height,
            x,
            y,
            unit,
            cssPath,
            image,
            selector
        }
        return template(this.tmpl, data)
    }

    getResource() {
        let sprites = []
        let ignore = this._basename(this.options.image)

        this.options.src.map(reg => {
            sprites.push(...glob.sync(reg))
        })

        return [...new Set(sprites.filter(p => ignore !== this._basename(p)).map(p => this._resolvePath(p)))]
    }

    _getTemplate() {
        let tmpl = ''
        let tmplPath = ''
        let opt = this.options
        let defaultPath = path.resolve(__dirname, './tmpl/sprite.tmpl')

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

    _resolvePath(...p) {
        return path.resolve.apply(null, [process.cwd(), ...p])
    }

    _basename(p) {
        return path.basename(p)
    }

    _name(p) {
        return this._basename(p).replace(/\.[\w\d]+$/, '')
    }

}

export default Lia
