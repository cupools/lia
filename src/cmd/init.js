import fs from 'fs-extra'
import path from 'path'
import log from '../utils/log'

export default function() {
    fs.copySync(path.resolve(__dirname, '../tmpl/sprite_conf.js'), path.resolve('sprite_conf.js'))
    log.build('sprite_conf.js')
}
