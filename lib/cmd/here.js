'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var image = 'sprites-' + _path2.default.basename(process.cwd()) + '.png';
    var sp = new _lia2.default({
        src: ['*.png'],
        image: image,
        algorithm: 'top-down',
        style: false
    });
    sp.run();
};

var _lia = require('../lia');

var _lia2 = _interopRequireDefault(_lia);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }