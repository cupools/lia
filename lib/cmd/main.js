'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var config = (0, _readConf2.default)();

    config.map(function (conf) {
        var lia = new _lia2.default(conf);
        lia.run();
    });
};

var _lia = require('../lia');

var _lia2 = _interopRequireDefault(_lia);

var _readConf = require('../utils/readConf');

var _readConf2 = _interopRequireDefault(_readConf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }