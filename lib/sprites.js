'use strict';

import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';
import child from 'child_process';

class Sprite {
    constructor(options) {
        this.options = Object.assign({
            src: ['./components/images/prize/*.png'],
            image: './components/sprites/sprites.png',
            style: './components/sprites/sprites.less',
            prefix: 'sprite-',
            cssPath: './',
            unit: 'rem',
            convert: 100,
            blank: 0,
            padding: 10,
            algorithm: 'binary-tree'
        }, options);
    }

    run() {
        let sprites = this._getResource();
        let opt = this.options;

        let ret = child.execFileSync(path.resolve(__dirname, 'spritesmith'), ['-sprites', JSON.stringify(sprites), '-options', JSON.stringify(opt)]);
        let result = JSON.parse(ret.toString());

        this._buildImage(result);
        this._buildStyle(result);
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

    _buildStyle({coordinates, properties}) {
        let content = [];
        let opt = this.options;
        let outputPath = this._resolvePath(opt.style);
        let totalWidth = properties.width;
        let totalHeight = properties.height;

        for(let originPath in coordinates) {
            if(coordinates.hasOwnProperty(originPath)) {
                let payload = coordinates[originPath];
                content.push(this._getTmpl(originPath, payload, {totalWidth, totalHeight}));
            }
        }

        this.outputStyle({
            content: content.join(''),
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

    _getResource() {
        let sprites = [];
        this.options.src.map(reg => {
            sprites.push(...glob.sync(reg));
        });

        return sprites.map(p => this._resolvePath(p));
    }

    _resolvePath(...p) {
        return path.resolve.apply(null, [process.cwd(), ...p]);
    }

    _basename(p) {
        return path.basename(p);
    }

    _name(p) {
        return this._basename(p).replace(/\.\w+$/, '');
    }

    _getTmpl(originPath, {width, height, x, y}, {totalWidth, totalHeight}) {
        let {unit, convert, cssPath, image, blank} = this.options;
        let destName = this._basename(image);
        let selector = this.options.prefix + this._name(originPath);

        if(unit === 'rem' && convert) {
            width = (width + blank) / convert;
            height = (height + blank) / convert;
            totalWidth = totalWidth / convert;
            totalHeight = totalHeight / convert;
            x = -x / convert;
            y = -y / convert;
        }
        return `.${selector} {
    width: ${width}${unit};
    height: ${height}${unit};
    background: url(${cssPath}${destName}) no-repeat;
    background-size: ${totalWidth}${unit} ${totalHeight}${unit};
    background-position: ${x}${unit} ${y}${unit};
}
`;
    }

}

export default Sprite;