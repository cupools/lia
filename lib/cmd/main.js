'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var config = [];
    var confPath = _path2.default.resolve(process.cwd(), 'sprites_conf.js');

    try {
        config = require(confPath);
    } catch (e) {
        _log2.default.warn('sprites_conf.js not Found. Try `sprites init`.');
    }

    config.map(function (conf) {
        var sp = new _sprites2.default(conf);
        sp.run();
    });
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sprites = require('../sprites');

var _sprites2 = _interopRequireDefault(_sprites);

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }