'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.default = function () {
    return watching.main();
};

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lia = require('../lia');

var _lia2 = _interopRequireDefault(_lia);

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

var _readConf = require('../utils/readConf');

var _readConf2 = _interopRequireDefault(_readConf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Task = function () {
    function Task(sprites) {
        (0, _classCallCheck3.default)(this, Task);

        this.sprites = sprites;
        this.resource = sprites.getResource();
        this.lastLength = this.resource.length;
        this.todo = true;
    }

    (0, _createClass3.default)(Task, [{
        key: 'check',
        value: function check(p) {
            var resource = this.resource;

            if (resource.length !== this.lastLength) {
                this.todo = true;
                this.lastLength = resource.length;
            } else if (resource.indexOf(p) > -1) {
                this.todo = true;
            }
        }
    }, {
        key: 'update',
        value: function update() {
            this.resource = this.sprites.getResource();
        }
    }, {
        key: 'run',
        value: function run() {
            if (this.todo) {
                this.todo = false;
                this.sprites.run();
            }
        }
    }]);
    return Task;
}();

var wait = 1000;

var watching = {
    tasks: [],
    pond: [],
    ignores: [],
    main: function main() {
        var _this = this;

        var config = (0, _readConf2.default)();

        config.map(function (conf) {
            var sprites = new _lia2.default(conf);
            var task = new Task(sprites);

            _this.tasks.push(task);
            _this.ignores.push(_path2.default.basename(conf.image).replace(/\.[\w\d]+$/, ''));
        });

        return this.watch();
    },
    watch: function watch() {
        var _this2 = this;

        var timer = null;
        var pond = this.pond;
        var ignores = this.ignores.join('|');
        var ignored = new RegExp(ignores);

        var watcher = _chokidar2.default.watch('**/*.png', {
            awaitWriteFinish: true,
            ignored: ignored
        });

        watcher.on('all', function (event, p) {
            pond.push(p);

            clearTimeout(timer);
            timer = setTimeout(function () {
                _this2.monitor();
            }, wait);
        });

        return watcher;
    },
    monitor: function monitor() {
        var start = Date.now();
        var tasks = this.tasks;
        var pond = this.pond;

        tasks.map(function (t) {
            return t.update();
        });

        var _loop = function _loop() {
            var p = pond.shift();
            var realPath = _path2.default.resolve(p);

            tasks.map(function (t) {
                return !t.todo && t.check(realPath);
            });
        };

        while (pond.length) {
            _loop();
        }

        tasks.map(function (t) {
            return t.run();
        });

        var end = Date.now();

        _log2.default.info('Finish in ' + (end - start) + 'ms. Waiting...');
    }
};