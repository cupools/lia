'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _psd = require('psd');

var _psd2 = _interopRequireDefault(_psd);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _pngjs = require('pngjs');

var _pngjs2 = _interopRequireDefault(_pngjs);

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

var _images = require('images');

var _images2 = _interopRequireDefault(_images);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TMP = './.lia';
var EXT = '.png';

function _process(option) {
    var psd = option.psd;

    var src = option.src.splice ? option.src : [option.src];
    var file = void 0;

    try {
        file = _psd2.default.fromFile(psd);
    } catch (e) {
        _log2.default.error(psd + ' not found');
        return false;
    }

    file.parse();

    var tree = file.tree();
    var stamp = Date.now();
    var isGlob = !(src.length === 1 && /\/$/.test(src[0]));
    var nodes = collect(tree, src, isGlob);

    var rawData = nodes.map(function (node) {
        var filename = (isGlob ? node.name : stamp++) + EXT;
        var output = _path2.default.resolve(TMP, filename);
        var buffer = read(node);

        return {
            buffer: buffer,
            output: output,
            node: node
        };
    });

    var data = unique(rawData);
    var items = output(data, isGlob);

    if (!data.length) {
        _log2.default.warn('No layer mapped for `' + option.src + '`');
        return false;
    }

    return {
        src: _path2.default.resolve(TMP, '*'),
        psd: {
            size: {
                width: tree.layer.right,
                height: tree.layer.bottom
            }
        },
        items: items
    };
}

function output(data, isGlob) {
    if (isGlob) {
        return data.map(function (item) {
            var buffer = item.buffer;
            var output = item.output;
            var node = item.node;
            var _node$layer = node.layer;
            var top = _node$layer.top;
            var left = _node$layer.left;
            var right = _node$layer.right;
            var bottom = _node$layer.bottom;
            var width = _node$layer.width;
            var height = _node$layer.height;
            var name = _node$layer.name;


            _fsExtra2.default.outputFileSync(output, buffer, 'binary');

            return {
                name: name,
                top: top,
                left: left,
                right: right,
                bottom: bottom,
                output: output,
                size: {
                    width: width,
                    height: height
                }
            };
        });
    } else {
        var _ret = function () {
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

            return {
                v: data.map(function (item) {
                    var node = item.node;
                    var buffer = item.buffer;
                    var output = item.output;
                    var _node$layer2 = node.layer;
                    var top = _node$layer2.top;
                    var left = _node$layer2.left;
                    var name = _node$layer2.name;


                    var img = (0, _images2.default)(destWidth, destHeight);
                    var main = (0, _images2.default)(buffer);
                    var content = img.draw(main, left - destLeft, top - destTop).encode('png');

                    _fsExtra2.default.outputFileSync(output, content, 'binary');

                    return {
                        name: name,
                        top: destTop,
                        left: destLeft,
                        right: destRight,
                        bottom: destBottom,
                        output: output,
                        size: {
                            width: destWidth,
                            height: destHeight
                        }
                    };
                })
            };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
    }
}

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

function unique(obj) {
    var _uniq = {};
    return obj.map(function (item) {
        var start = 0;

        while (_uniq[item.output + start]) {
            start += 1;
        }
        _uniq[item.output + start] = true;

        return (0, _assign2.default)({}, item, {
            output: item.output.replace('.png', (start || '') + '.png')
        });
    });
}

function read(node) {
    var png = node.toPng();
    return _pngjs2.default.PNG.sync.write(png);
}

function rewriteContext(psd, injectItems) {
    return function (context) {
        context.items.forEach(function (item) {
            var expect = item.name;

            injectItems.some(function (injectItem) {
                var output = injectItem.output;
                var layer = (0, _objectWithoutProperties3.default)(injectItem, ['output']);

                var actual = _path2.default.basename(output).replace(/\.[\w\d]+$/, '');
                var len = expect.length - actual.length;

                if (expect.slice(len) === actual) {
                    item.layer = layer;
                    return true;
                }
                return false;
            });
        });

        context.psd = psd;

        return context;
    };
}

exports.default = {
    process: function process(opt) {
        var ret = _process(opt);

        if (ret) {
            var src = ret.src;
            var psd = ret.psd;
            var items = ret.items;

            return {
                _ret: ret,
                rewriteOption: (0, _assign2.default)({}, opt, { src: src }),
                rewriteContext: rewriteContext(psd, items)
            };
        } else {
            return opt;
        }
    },
    clear: function clear() {
        _fsExtra2.default.removeSync(TMP);
    }
};