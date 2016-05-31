#!/usr/bin/env node

'use strict';

var fs = require('fs-extra');
var path = require('path');
var Sprites = require('../main');
var confPath = path.resolve(process.cwd(), 'sprites_conf.js');
var config = [];

var command = process.argv[2];

switch(command) {
    case '-h':
    case 'help':
        console.log('');
        console.log('Usage: \n');
        console.log('sprites            build sprite images and variables follow sprites_conf.js');
        console.log('sprites init       create sprites_conf.js');
        console.log('');
        break;

    case 'init':
        fs.copySync(path.resolve(__dirname, '../lib/tmpl/sprites_conf.tmpl'), path.resolve(process.cwd(), 'sprites_confsss.js'));
        console.log('  [build]: sprites_conf.js done.');
        break;

    default:
        try {
            config = require(confPath);
        } catch(e) {
            console.log('[warn]: sprites_conf.js not Found.');
        }

        config.map(conf => {
            var sp = new Sprites(conf);
            sp.run();
        });
}
