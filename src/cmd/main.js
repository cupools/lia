import Lia from '../lia'
import readConf from '../utils/readConf'

export default function() {
    let config = readConf()

    config.map(conf => {
        let lia = new Lia(conf)
        lia.run()
    })
}
