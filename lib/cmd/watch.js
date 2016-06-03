'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sprites = require('../sprites');

var _sprites2 = _interopRequireDefault(_sprites);

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function () {
    function Task(sprites) {
        _classCallCheck(this, Task);

        this.sprites = sprites;
        this.resource = sprites.getResource();
        this.lastLength = this.resource.length;
        this.todo = true;
    }

    _createClass(Task, [{
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

var tasks = [];
var pond = [];

var wait = 1000;

function main() {
    var config = [];
    var ignores = [];
    var confPath = _path2.default.resolve(process.cwd(), 'sprites_conf.js');

    try {
        config = require(confPath);
    } catch (e) {
        _log2.default.warn('sprites_conf.js not found or something wrong. Try `sprites init`.');
    }

    config.map(function (conf) {
        var sprites = new _sprites2.default(conf);
        var task = new Task(sprites);
        tasks.push(task);

        ignores.push(sprites._name(conf.image));
    });

    var timer = null;

    _chokidar2.default.watch('**/*.png', {
        awaitWriteFinish: true,
        ignored: new RegExp(ignores.join('|'))
    }).on('all', function (event, p) {
        pond.push(p);

        clearTimeout(timer);
        timer = setTimeout(monitor, wait);
    });
}

function monitor() {
    var start = +new Date();

    tasks.map(function (t) {
        return t.update();
    });

    var _loop = function _loop() {
        var p = pond.shift();
        var realPath = _path2.default.resolve(process.cwd(), p);

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

    var end = +new Date();

    _log2.default.info('Finish in ' + (end - start) / 1000 + 's. Waiting...');
}

exports.default = main;