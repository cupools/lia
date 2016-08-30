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
        _log2.default.warn('sprite_conf.js not Found. Try `lia init`.');
    }

    config.map(function (conf) {
        var lia = new _lia2.default(conf);
        lia.run();
    });
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lia = require('../lia');

var _lia2 = _interopRequireDefault(_lia);

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }