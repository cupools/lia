'use strict';

import fs from 'fs-extra';
import path from 'path';
import log from '../utils/log';

export default function () {
    fs.copySync(path.resolve(__dirname, '../lib/tmpl/sprites_conf.tmpl'), path.resolve(process.cwd(), 'sprites_conf.js'));
    log.build('sprites_conf.js done.');
}