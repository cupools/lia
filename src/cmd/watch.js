import chokidar from 'chokidar'
import path from 'path'
import Lia from '../lia'
import log from '../utils/log'

class Task {
    constructor(sprites) {
        this.sprites = sprites
        this.resource = sprites.getResource()
        this.lastLength = this.resource.length
        this.todo = true
    }
    check(p) {
        let resource = this.resource

        // 长度变化
        if (resource.length !== this.lastLength) {
            this.todo = true
            this.lastLength = resource.length
        } else if (resource.indexOf(p) > -1) {
            this.todo = true
        }
    }
    update() {
        this.resource = this.sprites.getResource()
    }
    run() {
        if (this.todo) {
            this.todo = false
            this.sprites.run()
        }
    }
}

const wait = 1000

let watching = {
    tasks: [],
    pond: [],
    ignores: [],
    main() {
        let config = []
        let confPath = path.resolve('sprite_conf.js')

        try {
            config = require(confPath)
        } catch (e) {
            log.warn('sprite_conf.js not found or something wrong. Try `sprites init`.')
            return false
        }

        config.map(conf => {
            let sprites = new Lia(conf)
            let task = new Task(sprites)

            this.tasks.push(task)
            this.ignores.push(path.basename(conf.image).replace(/\.[\w\d]+$/, ''))
        })

        return this.watch()
    },
    watch() {
        let timer = null
        let pond = this.pond
        let ignores = this.ignores.join('|')
        let ignored = new RegExp(ignores)

        let watcher = chokidar.watch('**/*.png', {
            awaitWriteFinish: true,
            ignored
        })

        watcher.on('all', (event, p) => {
            pond.push(p)

            clearTimeout(timer)
            timer = setTimeout(() => {
                this.monitor()
            }, wait)
        })

        return watcher
    },
    monitor() {
        let start = Date.now()
        let tasks = this.tasks
        let pond = this.pond

        tasks.map(t => t.update())

        while (pond.length) {
            let p = pond.shift()
            let realPath = path.resolve(p)

            tasks.map(t => !t.todo && t.check(realPath))
        }

        tasks.map(t => t.run())

        let end = Date.now()

        log.info(`Finish in ${end - start}ms. Waiting...`)
    }
}

export default function() {
    return watching.main()
}
