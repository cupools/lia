'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = true;

var log = function log(msg) {
    /* istanbul ignore next */
    process.env.NODE_ENV !== 'test' && state && console.log(msg);
};

log.info = function (msg) {
    log('[info]: ' + msg);
};

log.warn = function (msg) {
    log('[warn]: ' + _colors2.default.yellow(msg));
};

log.error = function (msg) {
    log('[error]: ' + _colors2.default.red(msg));
};

log.build = function (msg) {
    log.info('Create ' + _colors2.default.green(msg));
};

log.state = function (quiet) {
    state = !quiet;
};

exports.default = log;