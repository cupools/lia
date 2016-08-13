import Images from 'images'
import layout from './layout'

const INFINITE = 10e8

export default {
    process(files, options) {
        let {padding, algorithm} = options
        let layer = layout(algorithm)

        files.map(file => {
            let img = Images(file)
            let size = img.size()
            let meta = {
                file,
                img
            }

            let item = Object.assign({}, meta, {
                width: size.width + padding,
                height: size.height + padding
            })

            layer.addItem(item)
        })

        let {width, height, items} = layer.export()

        width -= padding
        height -= padding

        Images.setLimit(INFINITE, INFINITE)

        let sprite = Images(width, height)

        let coordinates = {}
        let properties = {
            width,
            height
        }

        items.map(item => {
            let {file, img, x, y, width, height} = item

            width -= padding
            height -= padding

            coordinates[file] = {
                x,
                y,
                size: {
                    width,
                    height
                }
            }

            sprite.draw(img, x, y)
        })

        return {
            image: sprite.encode('png'),
            coordinates,
            properties
        }
    }
}
