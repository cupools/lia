#!/usr/bin/env node


'use strict';

var Spritesmith = require('spritesmith');
var sprites = JSON.parse(process.argv[3]);
var options = JSON.parse(process.argv[5]);

Spritesmith.run({
    src: sprites,
    padding: options.padding,
    algorithm: options.algorithm
}, function (err, result) {
    if (!err) {
        process.stdout.write(JSON.stringify(result));
    } else {
        process.stdout.write(JSON.stringify({
            'error': err.message
        }));
    }
});