'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var usage = ['', '  Usage: lia [command]', '', '  Commands:', '', '    init                   Create sprite_conf.js', '    here                   Build sprite images in current directory', '    -w, watch              Monitor file changes and incremental recompilation', '    -h, help               Output usage information', ''].join('\n');

    (0, _log2.default)(usage);
};

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }