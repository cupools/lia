'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _images = require('images');

var _images2 = _interopRequireDefault(_images);

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INFINITE = 10e8;

exports.default = {
    process: function process(files, options) {
        var padding = options.padding;
        var algorithm = options.algorithm;

        var layer = (0, _layout2.default)(algorithm);

        files.map(function (file) {
            var img = (0, _images2.default)(file);
            var size = img.size();
            var meta = {
                file: file,
                img: img
            };

            var item = (0, _assign2.default)({}, meta, {
                width: size.width + padding,
                height: size.height + padding
            });

            layer.addItem(item);
        });

        var _layer$export = layer.export();

        var width = _layer$export.width;
        var height = _layer$export.height;
        var items = _layer$export.items;


        width -= padding;
        height -= padding;

        _images2.default.setLimit(INFINITE, INFINITE);

        var sprite = (0, _images2.default)(width, height);

        var coordinates = {};
        var properties = {
            width: width,
            height: height
        };

        items.map(function (item) {
            var file = item.file;
            var img = item.img;
            var x = item.x;
            var y = item.y;
            var width = item.width;
            var height = item.height;


            width -= padding;
            height -= padding;

            coordinates[file] = {
                x: x,
                y: y,
                size: {
                    width: width,
                    height: height
                }
            };

            sprite.draw(img, x, y);
        });

        return {
            image: sprite.encode('png'),
            coordinates: coordinates,
            properties: properties
        };
    }
};