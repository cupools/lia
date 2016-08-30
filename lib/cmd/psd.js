'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// TODO async coverage
/* istanbul ignore next */
var rewrite = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(option) {
        var _this = this;

        var psd, src, file, tree, stamp, isGlob, nodes, data;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        psd = option.psd;
                        src = option.src.splice ? option.src : [option.src];
                        file = void 0;
                        _context5.prev = 3;

                        file = _psd2.default.fromFile(psd);
                        _context5.next = 11;
                        break;

                    case 7:
                        _context5.prev = 7;
                        _context5.t0 = _context5['catch'](3);

                        _log2.default.error(psd + ' not found');
                        return _context5.abrupt('return', _promise2.default.resolve());

                    case 11:

                        file.parse();

                        tree = file.tree();
                        stamp = Date.now();
                        isGlob = !(src.length === 1 && /\/$/.test(src[0]));
                        nodes = collect(tree, src, isGlob);
                        _context5.next = 18;
                        return _promise2.default.all(nodes.map(function () {
                            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(node) {
                                var filename, output, buffer;
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                filename = stamp++ + EXT;
                                                output = _path2.default.resolve(TMP, filename);
                                                _context.next = 4;
                                                return read(node);

                                            case 4:
                                                buffer = _context.sent;
                                                return _context.abrupt('return', {
                                                    buffer: buffer,
                                                    output: output,
                                                    node: node
                                                });

                                            case 6:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this);
                            }));

                            return function (_x2) {
                                return _ref2.apply(this, arguments);
                            };
                        }()));

                    case 18:
                        data = _context5.sent;

                        if (data.length) {
                            _context5.next = 22;
                            break;
                        }

                        _log2.default.warn('No layer mapped for `' + option.src + '`');
                        return _context5.abrupt('return', _promise2.default.resolve());

                    case 22:
                        if (!isGlob) {
                            _context5.next = 27;
                            break;
                        }

                        _context5.next = 25;
                        return _promise2.default.all(data.map(function () {
                            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(item) {
                                var buffer, output;
                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                buffer = item.buffer;
                                                output = item.output;
                                                _context2.next = 4;
                                                return new _promise2.default(function (fulfill) {
                                                    return _fsExtra2.default.outputFile(output, buffer, 'binary', fulfill);
                                                });

                                            case 4:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, _this);
                            }));

                            return function (_x3) {
                                return _ref3.apply(this, arguments);
                            };
                        }()));

                    case 25:
                        _context5.next = 28;
                        break;

                    case 27:
                        return _context5.delegateYield(_regenerator2.default.mark(function _callee4() {
                            var destTop, destBottom, destLeft, destRight, destWidth, destHeight;
                            return _regenerator2.default.wrap(function _callee4$(_context4) {
                                while (1) {
                                    switch (_context4.prev = _context4.next) {
                                        case 0:
                                            destTop = Math.max(0, Math.min.apply(Math, (0, _toConsumableArray3.default)(data.map(function (item) {
                                                return item.node.layer.top;
                                            }))));
                                            destBottom = Math.max(0, Math.max.apply(Math, (0, _toConsumableArray3.default)(data.map(function (item) {
                                                return item.node.layer.bottom;
                                            }))));
                                            destLeft = Math.max(0, Math.min.apply(Math, (0, _toConsumableArray3.default)(data.map(function (item) {
                                                return item.node.layer.left;
                                            }))));
                                            destRight = Math.max(0, Math.max.apply(Math, (0, _toConsumableArray3.default)(data.map(function (item) {
                                                return item.node.layer.right;
                                            }))));
                                            destWidth = destRight - destLeft;
                                            destHeight = destBottom - destTop;
                                            _context4.next = 8;
                                            return _promise2.default.all(data.map(function () {
                                                var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(item) {
                                                    var node, buffer, output, _node$layer, top, left, img, main, buf;

                                                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                                                        while (1) {
                                                            switch (_context3.prev = _context3.next) {
                                                                case 0:
                                                                    node = item.node;
                                                                    buffer = item.buffer;
                                                                    output = item.output;
                                                                    _node$layer = node.layer;
                                                                    top = _node$layer.top;
                                                                    left = _node$layer.left;
                                                                    img = (0, _images2.default)(destWidth, destHeight);
                                                                    main = (0, _images2.default)(buffer);
                                                                    buf = img.draw(main, left - destLeft, top - destTop).encode('png');
                                                                    _context3.next = 11;
                                                                    return new _promise2.default(function (fulfill) {
                                                                        return _fsExtra2.default.outputFile(output, buf, 'binary', fulfill);
                                                                    });

                                                                case 11:
                                                                case 'end':
                                                                    return _context3.stop();
                                                            }
                                                        }
                                                    }, _callee3, _this);
                                                }));

                                                return function (_x4) {
                                                    return _ref4.apply(this, arguments);
                                                };
                                            }()));

                                        case 8:
                                        case 'end':
                                            return _context4.stop();
                                    }
                                }
                            }, _callee4, _this);
                        })(), 't1', 28);

                    case 28:
                        return _context5.abrupt('return', _promise2.default.resolve((0, _assign2.default)({}, option, {
                            src: _path2.default.resolve(TMP, '*')
                        })));

                    case 29:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this, [[3, 7]]);
    }));

    return function rewrite(_x) {
        return _ref.apply(this, arguments);
    };
}();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _psd = require('psd');

var _psd2 = _interopRequireDefault(_psd);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _lia = require('../lia');

var _lia2 = _interopRequireDefault(_lia);

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

var _images = require('images');

var _images2 = _interopRequireDefault(_images);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TMP = './.lia';
var EXT = '.png';

function collect(tree, src, isGlob) {
    return src.reduce(function (ret, pattern) {
        var childrens = void 0;

        if (isGlob) {
            (function () {
                var descendants = tree.descendants();
                var mm = new _minimatch2.default.Minimatch(pattern);
                childrens = descendants.filter(function (node) {
                    return mm.match(node.name);
                });
            })();
        } else {
            var groups = tree.childrenAtPath(pattern);
            var group = groups[0];

            if (group && groups.length > 1) {
                _log2.default.warn('Ignored ' + (groups.length - 1) + ' `' + pattern + '` while building keyframes');
            }

            childrens = group ? group.children() : [];
        }

        return ret.concat(childrens.filter(function (node) {
            return !node.isGroup() && !node.hidden();
        }));
    }, []);
}

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

            buffers.reduce(function (pos, chunk) {
                chunk.copy(buffer, pos);
                return pos + chunk.length;
            }, 0);

            fulfill(buffer);
        });
    });
}

function run(config) {
    var _this2 = this;

    return _promise2.default.all(config.map(function () {
        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(conf) {
            var option, lia;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.next = 2;
                            return rewrite(conf);

                        case 2:
                            option = _context6.sent;


                            if (option) {
                                lia = new _lia2.default(option);

                                lia.run();
                                _fsExtra2.default.removeSync(TMP);
                            }

                        case 4:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, _this2);
        }));

        return function (_x5) {
            return _ref5.apply(this, arguments);
        };
    }()));
}

exports.default = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
    var confPath, config;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
            switch (_context7.prev = _context7.next) {
                case 0:
                    confPath = _path2.default.resolve('sprite_conf.js');
                    config = void 0;
                    _context7.prev = 2;

                    config = require(confPath);
                    _context7.next = 10;
                    break;

                case 6:
                    _context7.prev = 6;
                    _context7.t0 = _context7['catch'](2);

                    _log2.default.warn('sprite_conf.js not Found. Try `lia init`.');
                    return _context7.abrupt('return', false);

                case 10:
                    _context7.next = 12;
                    return run(config).catch(function (e) {
                        throw e;
                    });

                case 12:
                case 'end':
                    return _context7.stop();
            }
        }
    }, _callee7, this, [[2, 6]]);
}));