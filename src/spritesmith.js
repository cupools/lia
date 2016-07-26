#!/usr/bin/env node

'use strict'

let Spritesmith = require('spritesmith')
let sprites = JSON.parse(process.argv[3])
let options = JSON.parse(process.argv[5])

Spritesmith.run({
    src: sprites,
    padding: options.padding,
    algorithm: options.algorithm
}, (err, result) => {
    if (!err) {
        process.stdout.write(JSON.stringify(result))
    } else {
        process.stdout.write(JSON.stringify({
            'error': err.message
        }))
    }
})
