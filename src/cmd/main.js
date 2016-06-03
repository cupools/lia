'use strict';

import path from 'path';
import Sprites from '../sprites';
import log from '../utils/log';

export default function () {
    let config = [];
    let confPath = path.resolve(process.cwd(), 'sprites_conf.js');

    try {
        config = require(confPath);
    } catch (e) {
        log.warn('sprites_conf.js not Found. Try `sprites init`.');
    }

    config.map(conf => {
        let sp = new Sprites(conf);
        sp.run();
    });
}