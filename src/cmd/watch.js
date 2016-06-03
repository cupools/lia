'use strict';

import chokidar from 'chokidar';
import path from 'path';
import Sprites from '../sprites';
import log from '../utils/log';

class Task {
    constructor(sprites) {
        this.sprites = sprites;
        this.resource = sprites.getResource();
        this.lastLength = this.resource.length;
        this.todo = true;
    }
    check(p) {
        let resource = this.resource;

        if (resource.length !== this.lastLength) {
            this.todo = true;
            this.lastLength = resource.length;
        } else if (resource.indexOf(p) > -1) {
            this.todo = true;
        }
    }
    update() {
        this.resource = this.sprites.getResource();
    }
    run() {
        if(this.todo) {
            this.todo = false;
            this.sprites.run();
        }
    }
}

let tasks = [];
let pond = [];

const wait = 1000;

function main() {
    let config = [];
    let ignores = [];
    let confPath = path.resolve(process.cwd(), 'sprites_conf.js');

    try {
        config = require(confPath);
    } catch (e) {
        log.warn('sprites_conf.js not found or something wrong. Try `sprites init`.');
    }

    config.map(conf => {
        let sprites = new Sprites(conf);
        let task = new Task(sprites);
        tasks.push(task);

        ignores.push(sprites._name(conf.image));
    });

    let timer = null;

    chokidar.watch('**/*.png', {
        awaitWriteFinish: true,
        ignored: new RegExp(ignores.join('|'))
    }).on('all', (event, p) => {
        pond.push(p);

        clearTimeout(timer);
        timer = setTimeout(monitor, wait);
    });
}

function monitor() {
    let start = +new Date();

    tasks.map(t => t.update());

    while(pond.length) {
        let p = pond.shift();
        let realPath = path.resolve(process.cwd(), p);

        tasks.map(t => !t.todo && t.check(realPath));
    }

    tasks.map(t => t.run());

    let end = +new Date();

    log.info(`Finish in ${(end - start) / 1000}s. Waiting...`);
}

export default main;