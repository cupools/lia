import log from '../utils/log'

export default function() {
    let usage = [
        '',
        '  Usage: lia [command]',
        '',
        '  Commands:',
        '',
        '    init                   Create sprite_conf.js',
        '    here                   Build sprite images in current directory',
        '    -w, watch              Monitor file changes and incremental recompilation',
        '    -h, help               Output usage information',
        ''
    ].join('\n')

    log(usage)
}
