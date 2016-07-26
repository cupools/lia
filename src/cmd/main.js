import path from 'path'
import Sprites from '../lia'
import log from '../utils/log'

export default function() {
    let config = []
    let confPath = path.resolve(process.cwd(), 'sprite_conf.js')

    try {
        config = require(confPath)
    } catch (e) {
        log.warn('sprite_conf.js not Found. Try `lia init`.')
    }

    config.map(conf => {
        let sp = new Sprites(conf)
        sp.run()
    })
}
