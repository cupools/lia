'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _image = require('./utils/image');

var _image2 = _interopRequireDefault(_image);

var _psd = require('./utils/psd');

var _psd2 = _interopRequireDefault(_psd);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Lia = function () {
    function Lia(options) {
        (0, _classCallCheck3.default)(this, Lia);

        if (options.psd) {
            var _psd$process = _psd2.default.process(options);

            var rewriteOption = _psd$process.rewriteOption;
            var rewriteContext = _psd$process.rewriteContext;

            options = rewriteOption;
            this.rewriteContext = rewriteContext;
        }

        this.options = (0, _assign2.default)({
            src: ['*.png'],
            image: 'build/sprite.png',
            style: 'build/sprite.css',
            prefix: '',
            cssPath: './',
            unit: 'px',
            convert: 1,
            decimalPlaces: 6,
            blank: 0,
            padding: 10,
            algorithm: 'binary-tree',
            tmpl: '',
            quiet: false,
            psd: false
        }, options, {
            src: options.src.splice ? options.src : [options.src]
        });

        this.tmpl = this._getTemplate();
        _log2.default.state(this.options.quiet);
    }

    (0, _createClass3.default)(Lia, [{
        key: 'run',
        value: function run() {
            var sprites = this.getResource();
            var opt = this.options;

            if (!sprites.length) {
                _log2.default.warn('No images mapped for `' + opt.src + '`');
                return false;
            }

            var result = _image2.default.process(sprites, opt);

            if (opt.image) {
                this._buildImage(result);
            } else {
                _log2.default.error('`options.image` should not be null');
                return false;
            }

            if (opt.style) {
                this._outputStyle(result);
            }

            if (opt.psd) {
                _psd2.default.clear();
            }
        }
    }, {
        key: '_buildImage',
        value: function _buildImage(_ref) {
            var image = _ref.image;

            var opt = this.options;
            var outputPath = _path2.default.resolve(opt.image);
            var content = new Buffer(image);

            this.outputImage({
                content: content,
                outputPath: outputPath,
                opt: opt
            });
        }
    }, {
        key: '_outputStyle',
        value: function _outputStyle(result) {
            var opt = this.options;
            var outputPath = _path2.default.resolve(opt.style);
            var content = _ejs2.default.render(this._getTemplate(), this._renderData(result));

            this.outputStyle({
                content: content,
                outputPath: outputPath,
                opt: opt
            });
        }
    }, {
        key: '_renderData',
        value: function _renderData(_ref2) {
            var _this = this;

            var properties = _ref2.properties;
            var coordinates = _ref2.coordinates;

            var _options = this.options;
            var blank = _options.blank;


            var width = this._decimal(properties.width);
            var height = this._decimal(properties.height);

            var basename = _path2.default.basename(_options.image);
            var p = _options.cssPath + _path2.default.basename(_options.image);
            var realpath = _path2.default.resolve(_options.image);
            var unit = _options.unit;
            var size = {
                width: width,
                height: height
            };

            var items = (0, _keys2.default)(coordinates).map(function (_realpath) {
                var _coordinates$_realpat = coordinates[_realpath];
                var x = _coordinates$_realpat.x;
                var y = _coordinates$_realpat.y;
                var size = _coordinates$_realpat.size;

                var name = _options.prefix + _this._filename(_realpath);
                var width = _this._decimal(size.width + blank);
                var height = _this._decimal(size.height + blank);
                x = _this._decimal(x);
                y = _this._decimal(y);

                return {
                    name: name,
                    size: {
                        width: width,
                        height: height
                    },
                    x: x,
                    y: y
                };
            });

            return this.rewriteContext({
                basename: basename,
                path: p,
                realpath: realpath,
                unit: unit,
                size: size,
                items: items,
                _options: _options
            });
        }
    }, {
        key: 'outputImage',
        value: function outputImage(_ref3) {
            var outputPath = _ref3.outputPath;
            var content = _ref3.content;
            var opt = _ref3.opt;

            _fsExtra2.default.outputFileSync(outputPath, content, 'binary');
            _log2.default.build(opt.image);
        }
    }, {
        key: 'outputStyle',
        value: function outputStyle(_ref4) {
            var outputPath = _ref4.outputPath;
            var content = _ref4.content;
            var opt = _ref4.opt;

            _fsExtra2.default.outputFileSync(outputPath, content, 'utf8');
            _log2.default.build(opt.style);
        }
    }, {
        key: 'getResource',
        value: function getResource() {
            var sprites = [];
            var ignore = _path2.default.basename(this.options.image);

            this.options.src.map(function (reg) {
                sprites.push.apply(sprites, (0, _toConsumableArray3.default)(_glob2.default.sync(reg)));
            });

            return [].concat((0, _toConsumableArray3.default)(new _set2.default(sprites.filter(function (p) {
                return ignore !== _path2.default.basename(p);
            }).map(function (p) {
                return _path2.default.resolve(p);
            }))));
        }
    }, {
        key: 'rewriteContext',
        value: function rewriteContext(context) {
            return context;
        }
    }, {
        key: '_getTemplate',
        value: function _getTemplate() {
            var tmpl = '';
            var tmplPath = '';
            var opt = this.options;
            var defaultPath = _path2.default.resolve(__dirname, './tmpl/template.ejs');

            if (opt.tmpl) {
                tmplPath = _path2.default.resolve(opt.tmpl);
            } else {
                tmplPath = defaultPath;
            }

            try {
                tmpl = _fsExtra2.default.readFileSync(tmplPath, 'utf-8');
            } catch (e) {
                _log2.default.warn('`' + opt.tmpl + '` not found.');
                tmpl = _fsExtra2.default.readFileSync(defaultPath, 'utf-8');
            }

            return tmpl;
        }
    }, {
        key: '_filename',
        value: function _filename(p) {
            return _path2.default.basename(p).replace(/\.[\w\d]+$/, '');
        }
    }, {
        key: '_decimal',
        value: function _decimal(count) {
            var _options2 = this.options;
            var decimalPlaces = _options2.decimalPlaces;
            var convert = _options2.convert;

            return convert && convert !== 1 ? Number((count / convert).toFixed(decimalPlaces)) : count;
        }
    }]);
    return Lia;
}();

exports.default = Lia;