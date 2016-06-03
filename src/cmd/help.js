'use strict';

import log from '../utils/log';

export default function () {
    log('');
    log('Usage: \n');
    log('sprites              Build sprite images and variables follow sprites_conf.js');
    log('sprites init         Create sprites_conf.js');
    log('sprites now          Build sprite images in current directory');
    log('sprites -w, watch    Recompile files on changes');
    log('sprites -h, help     Output usage information');
    log('');
}