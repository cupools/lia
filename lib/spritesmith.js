#!/usr/bin/env node


'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Spritesmith = require('spritesmith');
var sprites = JSON.parse(process.argv[3]);
var options = JSON.parse(process.argv[5]);

Spritesmith.run({
    src: sprites,
    padding: options.padding,
    algorithm: options.algorithm
}, function (err, result) {
    if (!err) {
        process.stdout.write((0, _stringify2.default)(result));
    } else {
        process.stdout.write((0, _stringify2.default)({
            'error': err.message
        }));
    }
});