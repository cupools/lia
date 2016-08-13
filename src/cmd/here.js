import Lia from '../lia'
import path from 'path'

export default function() {
    let image = 'sprite-' + path.basename(process.cwd()) + '.png'
    let lia = new Lia({
        src: ['*.png'],
        image: image,
        algorithm: 'left-right',
        padding: 0,
        style: false
    })

    lia.run()
}
