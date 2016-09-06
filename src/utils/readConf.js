import path from 'path'
import log from '../utils/log'

export default function() {
    let confPath = path.resolve('sprite_conf.js')
    let config = []

    try {
        config = require(confPath)
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            log.warn('sprite_conf.js not Found. Try `lia init`.')
        } else {
            log.error(e.message)
        }
    }

    return config
}
