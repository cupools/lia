import colors from 'colors'

let state = true

let log = function(msg) {
    /* istanbul ignore next */
    state && console.log(msg)
}

log.info = function(msg) {
    log('[info]: ' + msg)
}

log.warn = function(msg) {
    log('[warn]: ' + colors.yellow(msg))
}

log.build = function(msg) {
    log.info('Created ' + colors.green(msg))
}

log.state = function(quiet) {
    state = !quiet
}

export default log
