'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var confPath = _path2.default.resolve('sprite_conf.js');
    var config = [];

    try {
        config = require(confPath);
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            _log2.default.warn('sprite_conf.js not Found. Try `lia init`.');
        } else {
            _log2.default.error(e.message);
        }
    }

    return config;
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }