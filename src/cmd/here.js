import Lia from '../lia'
import path from 'path'

export default function() {
    let image = 'sprites-' + path.basename(process.cwd()) + '.png'
    let sp = new Lia({
        src: ['*.png'],
        image: image,
        algorithm: 'top-down',
        style: false
    })

    sp.run()
}
