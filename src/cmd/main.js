import path from 'path'
import Lia from '../lia'
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
        let lia = new Lia(conf)
        lia.run()
    })
}
