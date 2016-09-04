import path from 'path'
import fs from 'fs-extra'
import PSD from 'psd'
import minimatch from 'minimatch'
import pngjs from 'pngjs'

import log from '../utils/log'
import images from 'images'

const TMP = './.lia'
const EXT = '.png'

function process(option) {
    let {psd} = option
    let src = option.src.splice ? option.src : [option.src]
    let file

    try {
        file = PSD.fromFile(psd)
    } catch (e) {
        log.error(`${psd} not found`)
        return false
    }

    file.parse()

    let tree = file.tree()
    let stamp = Date.now()
    let isGlob = !(src.length === 1 && /\/$/.test(src[0]))
    let nodes = collect(tree, src, isGlob)

    let rawData = nodes.map(node => {
        let filename = (isGlob ? node.name : stamp++) + EXT
        let output = path.resolve(TMP, filename)
        let buffer = read(node)

        return {
            buffer,
            output,
            node
        }
    })

    let data = unique(rawData)
    let items = output(data, isGlob)

    if (!data.length) {
        log.warn(`No layer mapped for \`${option.src}\``)
        return false
    }

    return {
        src: path.resolve(TMP, '*'),
        psd: {
            size: {
                width: tree.layer.right,
                height: tree.layer.bottom
            }
        },
        items
    }
}

function output(data, isGlob) {
    if (isGlob) {
        return data.map(item => {
            let {buffer, output, node} = item
            let {top, left, right, bottom, width, height, name} = node.layer

            fs.outputFileSync(output, buffer, 'binary')

            return {
                name,
                top,
                left,
                right,
                bottom,
                output,
                size: {
                    width,
                    height
                }
            }
        })
    } else {
        let destTop = Math.max(0, Math.min(...data.map(item => item.node.layer.top)))
        let destBottom = Math.max(0, Math.max(...data.map(item => item.node.layer.bottom)))
        let destLeft = Math.max(0, Math.min(...data.map(item => item.node.layer.left)))
        let destRight = Math.max(0, Math.max(...data.map(item => item.node.layer.right)))

        let destWidth = destRight - destLeft
        let destHeight = destBottom - destTop

        return data.map(item => {
            let {node, buffer, output} = item
            let {top, left, name} = node.layer

            let img = images(destWidth, destHeight)
            let main = images(buffer)
            let content = img.draw(main, left - destLeft, top - destTop).encode('png')

            fs.outputFileSync(output, content, 'binary')

            return {
                name,
                top: destTop,
                left: destLeft,
                right: destRight,
                bottom: destBottom,
                output,
                size: {
                    width: destWidth,
                    height: destHeight
                }
            }
        })
    }
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

function unique(obj) {
    let _uniq = {}
    return obj.map(item => {
        let start = 0

        while (_uniq[item.output + start]) {
            start += 1
        }
        _uniq[item.output + start] = true

        return Object.assign({}, item, {
            output: item.output.replace('.png', (start || '') + '.png')
        })
    })
}

function read(node) {
    let png = node.toPng()
    return pngjs.PNG.sync.write(png)
}

function rewriteContext(psd, injectItems) {
    return function(context) {
        context.items.forEach(item => {
            let expect = item.name

            injectItems.some(injectItem => {
                let {output, ...layer} = injectItem
                let actual = path.basename(output).replace(/\.[\w\d]+$/, '')
                let len = expect.length - actual.length

                if (expect.slice(len) === actual) {
                    item.layer = layer
                    return true
                }
                return false
            })
        })

        context.psd = psd

        return context
    }
}

export default {
    process(opt) {
        let ret = process(opt)

        if (ret) {
            let {src, psd, items} = ret
            return {
                _ret: ret,
                rewriteOption: Object.assign({}, opt, {src}),
                rewriteContext: rewriteContext(psd, items)
            }
        } else {
            return opt
        }
    },
    clear() {
        fs.removeSync(TMP)
    }
}
