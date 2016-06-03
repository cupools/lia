'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    _fsExtra2.default.copySync(_path2.default.resolve(__dirname, '../tmpl/sprites_conf.tmpl'), _path2.default.resolve(process.cwd(), 'sprites_conf.js'));
    _log2.default.build('sprites_conf.js');
};

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }