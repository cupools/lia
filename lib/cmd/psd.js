'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var rewrite = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(option) {
        var src, psd, file, tree, stamp, destSrc;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        src = option.src;
                        psd = option.psd;
                        file = _psd2.default.fromFile(psd);


                        file.parse();

                        tree = file.tree();
                        stamp = Date.now();
                        _context.next = 8;
                        return _promise2.default.all(src.map(function (pattern, index) {
                            return new _promise2.default(function (fulfill) {
                                var group = tree.childrenAtPath(pattern)[0];
                                var children = group ? group.children() : [];

                                return _promise2.default.all(children.map(function (node) {
                                    return new _promise2.default(function (fulfill) {
                                        var filename = '' + stamp++ + EXT;
                                        var output = _path2.default.resolve(TMP, index + '', filename);

                                        return read(node).then(function (buffer) {
                                            return fulfill({
                                                buffer: buffer,
                                                output: output,
                                                node: node
                                            });
                                        });
                                    });
                                })).then(function (data) {
                                    var destTop = Math.max(0, Math.min.apply(Math, (0, _toConsumableArray3.default)(data.map(function (item) {
                                        return item.node.layer.top;
                                    }))));
                                    var destBottom = Math.max(0, Math.max.apply(Math, (0, _toConsumableArray3.default)(data.map(function (item) {
                                        return item.node.layer.bottom;
                                    }))));
                                    var destLeft = Math.max(0, Math.min.apply(Math, (0, _toConsumableArray3.default)(data.map(function (item) {
                                        return item.node.layer.left;
                                    }))));
                                    var destRight = Math.max(0, Math.max.apply(Math, (0, _toConsumableArray3.default)(data.map(function (item) {
                                        return item.node.layer.right;
                                    }))));

                                    var destWidth = destRight - destLeft;
                                    var destHeight = destBottom - destTop;

                                    data.forEach(function (item) {
                                        var node = item.node;
                                        var buffer = item.buffer;
                                        var output = item.output;
                                        var _node$layer = node.layer;
                                        var top = _node$layer.top;
                                        var left = _node$layer.left;


                                        if (!node.hidden()) {
                                            var img = (0, _images2.default)(destWidth, destHeight);
                                            var main = (0, _images2.default)(buffer);
                                            var buf = img.draw(main, left - destLeft, top - destTop).encode('png');

                                            _fsExtra2.default.outputFileSync(output, buf, 'binary');
                                        }
                                    });
                                }).then(function () {
                                    fulfill(_path2.default.join(TMP, index + '', '/*'));
                                });
                            });
                        }));

                    case 8:
                        destSrc = _context.sent;
                        return _context.abrupt('return', _promise2.default.resolve((0, _assign2.default)({}, option, {
                            src: destSrc
                        })));

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function rewrite(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = function () {
    var confPath = _path2.default.resolve(process.cwd(), 'sprite_conf.js');
    var config = void 0;

    try {
        config = require(confPath);
    } catch (e) {
        _log2.default.warn('sprite_conf.js not Found. Try `lia init`.');
        return _promise2.default.reject();
    }

    return _promise2.default.all(config.map(function (conf) {
        return new _promise2.default(function (fulfill) {
            return rewrite(conf).then(fulfill);
        });
    })).then(function (config) {
        config.forEach(function (option) {
            var lia = new _lia2.default(option);
            lia.run();
        });
        _fsExtra2.default.removeSync(TMP);
    });
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _psd = require('psd');

var _psd2 = _interopRequireDefault(_psd);

var _lia = require('../lia');

var _lia2 = _interopRequireDefault(_lia);

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

var _images = require('images');

var _images2 = _interopRequireDefault(_images);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TMP = './.lia';
var EXT = '.png';

function read(node) {
    return new _promise2.default(function (fulfill) {
        var png = node.toPng();

        var buffers = [];
        var nread = 0;

        var readStream = png.pack();

        readStream.on('data', function (chunk) {
            buffers.push(chunk);
            nread += chunk.length;
        });
        readStream.on('end', function () {
            var buffer = new Buffer(nread);

            for (var i = 0, pos = 0, l = buffers.length; i < l; i++) {
                var chunk = buffers[i];
                chunk.copy(buffer, pos);
                pos += chunk.length;
            }

            fulfill(buffer);
        });
    });
}