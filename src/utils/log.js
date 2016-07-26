import colors from 'colors'

let state = true

let log = function(msg) {
    state && console.log(msg)
}

log.info = function(msg) {
    log('[info]: ' + msg)
}

log.warn = function(msg) {
    log('[warn]: ' + colors.yellow(msg))
}

log.error = function(msg) {
    log('[error]: ' + colors.red(msg))
}

log.build = function(msg) {
    log.info('Created ' + colors.green(msg))
}

log.state = function(quiet) {
    state = !quiet
}

export default log
