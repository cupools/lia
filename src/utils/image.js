import images from 'images'
import path from 'path'

export default {
    process(files, options) {
        let sprite = images(200, 500)

        files.map((file, idx) => {
            let img = images(file)
            sprite.draw(img, 0, idx * 50)
        })

        sprite.save(path.join(process.cwd(), 'test/tmp/test.png'))
    }
}
