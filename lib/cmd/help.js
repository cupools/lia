'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    (0, _log2.default)('');
    (0, _log2.default)('Usage: \n');
    (0, _log2.default)('sprites              Build sprite images and variables follow sprites_conf.js');
    (0, _log2.default)('sprites init         Create sprites_conf.js');
    (0, _log2.default)('sprites now          Build sprite images in current directory');
    (0, _log2.default)('sprites -w, watch    Recompile files on changes');
    (0, _log2.default)('sprites -h, help     Output usage information');
    (0, _log2.default)('');
};

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }