import path from 'path'
import Lia from '../lia'
import log from '../utils/log'

export default function() {
    let confPath = path.resolve('sprite_conf.js')
    let config = []

    try {
        config = require(confPath)
    } catch (e) {
        log.warn('sprite_conf.js not Found. Try `lia init`.')
    }

    config.map(conf => {
        let lia = new Lia(conf)
        lia.run()
    })
}
