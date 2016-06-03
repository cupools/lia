'use strict';

import colors from 'colors';

let log = function(msg) {
    console.log(msg);
};

log.info = function(msg) {
    console.log('[info]: ' + msg);
};

log.warn = function(msg) {
    console.log('[warn]: ' + colors.yellow(msg));
};

log.error = function(msg) {
    console.log('[error]: ' + colors.red(msg));
};

log.build = function(msg) {
    log.info('Created ' + colors.green(msg));
};

export default log;