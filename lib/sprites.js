'use strict';

import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';
import child from 'child_process';
import template from 'es6-template-strings';

class Sprite {
    constructor(options) {
        this.options = Object.assign({
            src: ['./components/images/sprites-*.png'],
            image: './components/sprites/sprites.png',
            style: './components/sprites/sprites.scss',
            prefix: 'sprites-',
            cssPath: './',
            unit: 'rem',
            convert: 100,
            blank: 0,
            padding: 10,
            algorithm: 'binary-tree',
            tmpl: '',
            wrap: ''
        }, options);

        this.tmpl = this._getTemplate();
    }

    run() {
        let sprites = this._getResource();
        let opt = this.options;

        let ret = child.execFileSync(path.resolve(__dirname, 'spritesmith'), ['-sprites', JSON.stringify(sprites), '-options', JSON.stringify(opt)]);
        let result = JSON.parse(ret.toString());

        this._buildImage(result);
        this._outputStyle(result);
    }

    _buildImage({image}) {
        let opt = this.options;
        let outputPath = this._resolvePath(opt.image);
        let content = new Buffer(image);

        this.outputImage({
            content,
            outputPath,
            opt
        });
    }

    _outputStyle({coordinates, properties}) {
        let store = [];
        let opt = this.options;
        let outputPath = this._resolvePath(opt.style);
        let totalWidth = properties.width;
        let totalHeight = properties.height;

        for(let originPath in coordinates) {
            if(coordinates.hasOwnProperty(originPath)) {
                let payload = coordinates[originPath];
                store.push(this._render(originPath, payload, {totalWidth, totalHeight}));
            }
        }

        let content = store.join('');
        let wrap = this.options.wrap;

        if(wrap) {
            content = template(wrap, {content});
        }

        this.outputStyle({
            content,
            outputPath,
            opt
        });
    }

    outputImage({outputPath, content, opt}) {
        fs.outputFile(outputPath, content, 'binary', (err) => {
            if(err) {
                throw err;
            }
            console.log(`  [build]: ${opt.image}`);
        });
    }

    outputStyle({outputPath, content, opt}) {
        fs.outputFile(outputPath, content, 'utf8', (err) => {
            if(err) {
                throw err;
            }
            console.log(`  [build]: ${opt.style}`);
        });
    }

    _render(originPath, {width, height, x, y}, {totalWidth, totalHeight}) {
        let {unit, convert, cssPath, image, blank} = this.options;
        let imageName = this._basename(image);
        let name = this._name(originPath);
        let selector = this.options.prefix + name;

        if(unit === 'rem' && convert) {
            width = (width + blank) / convert;
            height = (height + blank) / convert;
            totalWidth = totalWidth / convert;
            totalHeight = totalHeight / convert;
            x = -x / convert;
            y = -y / convert;
        }

        let data = {name, imageName, totalWidth, width, totalHeight, height, x, y, unit, cssPath, image, selector};
        return template(this.tmpl, data);
    }

    _getResource() {
        let sprites = [];
        this.options.src.map(reg => {
            sprites.push(...glob.sync(reg));
        });

        return sprites.map(p => this._resolvePath(p));
    }

    _getTemplate() {
        let tmpl = '';
        try {
            tmpl = fs.readFileSync(path.resolve(process.cwd(), this.options.tmpl), 'utf-8');
        } catch(e) {
            tmpl = fs.readFileSync(path.resolve(__dirname, './tmpl/sprites.tmpl'), 'utf-8');
        }
        return tmpl;
    }

    _resolvePath(...p) {
        return path.resolve.apply(null, [process.cwd(), ...p]);
    }

    _basename(p) {
        return path.basename(p);
    }

    _name(p) {
        return this._basename(p).replace(/\.[\w\d]+$/, '');
    }

}

export default Sprite;