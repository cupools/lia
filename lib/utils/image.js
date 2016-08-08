'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _images = require('images');

var _images2 = _interopRequireDefault(_images);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    process: function (_process) {
        function process(_x, _x2) {
            return _process.apply(this, arguments);
        }

        process.toString = function () {
            return _process.toString();
        };

        return process;
    }(function (files, options) {
        var sprite = (0, _images2.default)(200, 500);

        files.map(function (file, idx) {
            var img = (0, _images2.default)(file);
            sprite.draw(img, 0, idx * 50);
        });

        sprite.save(_path2.default.join(process.cwd(), 'test/tmp/test.png'));
    })
};