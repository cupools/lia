#!/usr/bin/env node

'use strict';

let fs = require('fs-extra');
let path = require('path');
let Sprites = require('../main');
let confPath = path.resolve(process.cwd(), 'sprites_conf.js');

let command = process.argv[2];

switch(command) {
    case '-h':
    case 'help':
        console.log('');
        console.log('Usage: \n');
        console.log('sprites            build sprite images and variables follow sprites_conf.js');
        console.log('sprites init       create sprites_conf.js');
        console.log('sprites now        build sprite images in current directory');
        console.log('');
        break;

    case 'init':
        fs.copySync(path.resolve(__dirname, '../lib/tmpl/sprites_conf.tmpl'), path.resolve(process.cwd(), 'sprites_conf.js'));
        console.log('  [build]: sprites_conf.js done.');
        break;

    case 'now':
        let image = 'sprites-' + path.basename(process.cwd()) + '.png';
        let sp = new Sprites({
            src: ['*.png'],
            image: image,
            algorithm: 'top-down',
            style: false
        });
        sp.run();
        break;

    default:
        let config = [];
        try {
            config = require(confPath);
        } catch(e) {
            console.log('[warn]: sprites_conf.js not Found. Try `sprites init`.');
        }

        config.map(conf => {
            let sp = new Sprites(conf);
            sp.run();
        });
}
