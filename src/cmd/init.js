import fs from 'fs-extra'
import path from 'path'
import log from '../utils/log'

export default function() {
    fs.copySync(path.resolve(__dirname, '../tmpl/sprite_conf.tmpl'), path.resolve(process.cwd(), 'sprite_conf.js'))
    log.build('sprite_conf.js')
}
