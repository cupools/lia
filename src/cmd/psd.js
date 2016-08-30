import path from 'path'
import fs from 'fs-extra'
import PSD from 'psd'
import minimatch from 'minimatch'

import Lia from '../lia'
import log from '../utils/log'
import images from 'images'

const TMP = './.lia'
const EXT = '.png'

// TODO async coverage
/* istanbul ignore next */
async function rewrite(option) {
    let {psd} = option
    let src = option.src.splice ? option.src : [option.src]
    let file

    try {
        file = PSD.fromFile(psd)
    } catch (e) {
        log.error(`${psd} not found`)
        return Promise.resolve()
    }

    file.parse()

    let tree = file.tree()
    let stamp = Date.now()
    let isGlob = !(src.length === 1 && /\/$/.test(src[0]))
    let nodes = collect(tree, src, isGlob)

    let data = await Promise.all(nodes.map(async node => {
        let filename = (stamp++) + EXT
        let output = path.resolve(TMP, filename)
        let buffer = await read(node)

        return {
            buffer,
            output,
            node
        }
    }))

    if (!data.length) {
        log.warn(`No layer mapped for \`${option.src}\``)
        return Promise.resolve()
    }

    if (isGlob) {
        await Promise.all(data.map(async item => {
            let {buffer, output} = item

            await new Promise(fulfill => fs.outputFile(output, buffer, 'binary', fulfill))
        }))
    } else {
        let destTop = Math.max(0, Math.min(...data.map(item => item.node.layer.top)))
        let destBottom = Math.max(0, Math.max(...data.map(item => item.node.layer.bottom)))
        let destLeft = Math.max(0, Math.min(...data.map(item => item.node.layer.left)))
        let destRight = Math.max(0, Math.max(...data.map(item => item.node.layer.right)))

        let destWidth = destRight - destLeft
        let destHeight = destBottom - destTop

        await Promise.all(data.map(async item => {
            let {node, buffer, output} = item
            let {top, left} = node.layer

            let img = images(destWidth, destHeight)
            let main = images(buffer)
            let buf = img.draw(main, left - destLeft, top - destTop).encode('png')

            await new Promise(fulfill => fs.outputFile(output, buf, 'binary', fulfill))
        }))
    }

    return Promise.resolve(Object.assign({}, option, {
        src: path.resolve(TMP, '*')
    }))
}

function collect(tree, src, isGlob) {
    return src.reduce((ret, pattern) => {
        let childrens

        if (isGlob) {
            let descendants = tree.descendants()
            let mm = new minimatch.Minimatch(pattern)
            childrens = descendants.filter(node => mm.match(node.name))
        } else {
            let groups = tree.childrenAtPath(pattern)
            let group = groups[0]

            if (group && groups.length > 1) {
                log.warn(`Ignored ${groups.length - 1} \`${pattern}\` while building keyframes`)
            }

            childrens = group ? group.children() : []
        }

        return ret.concat(childrens.filter(node => !node.isGroup() && !node.hidden()))
    }, [])
}

function read(node) {
    return new Promise(fulfill => {
        let png = node.toPng()

        var buffers = []
        var nread = 0

        let readStream = png.pack()

        readStream.on('data', function(chunk) {
            buffers.push(chunk)
            nread += chunk.length
        })
        readStream.on('end', function() {
            let buffer = new Buffer(nread)

            buffers.reduce((pos, chunk) => {
                chunk.copy(buffer, pos)
                return pos + chunk.length
            }, 0)

            fulfill(buffer)
        })
    })
}

function run(config) {
    return Promise.all(config.map(async conf => {
        let option = await rewrite(conf)

        if (option) {
            let lia = new Lia(option)
            lia.run()
            fs.removeSync(TMP)
        }
    }))
}

export default async function() {
    let confPath = path.resolve('sprite_conf.js')
    let config

    try {
        config = require(confPath)
    } catch (e) {
        log.warn('sprite_conf.js not Found. Try `lia init`.')
        return false
    }

    await run(config).catch(e => {
        throw e
    })
}
