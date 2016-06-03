'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = function log(msg) {
    console.log(msg);
};

log.info = function (msg) {
    console.log('[info]: ' + msg);
};

log.warn = function (msg) {
    console.log('[warn]: ' + _colors2.default.yellow(msg));
};

log.error = function (msg) {
    console.log('[error]: ' + _colors2.default.red(msg));
};

log.build = function (msg) {
    log.info('Created ' + _colors2.default.green(msg));
};

exports.default = log;