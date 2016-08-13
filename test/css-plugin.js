import fs from 'fs-extra'
import postcss from 'postcss'
import chai from 'chai'

/**
 * @example
 * expect('path/foo.css').to.be.exist
 * expect('path/foo.css').to.have.selector('.foo')
 * expect('path/foo.css').to.have.selector('.foo').and.decl({
 *     width: '100px',
 *     height: '50px'
 * })
 */
chai.use(cssPlugin)

function cssPlugin(chai, utils) {
    let {Assertion} = chai

    Assertion.addChainableMethod('selector', function(selector) {
        let path = utils.flag(this, 'object')
        let content = ''

        try {
            content = fs.readFileSync(path, 'utf8')
        } catch (e) {}

        let {root} = postcss().process(content)
        let rule = null

        root.walkRules(r => {
            if (r.selector === selector) {
                rule = r
            }
        })

        utils.flag(this, 'rule', rule)

        new Assertion(path).to.be.exist

        this.assert(
            !!rule,
            `expect #{this} to have selector \`${selector}\``,
            `expect #{this} to miss selector \`${selector}\``
        )
    })

    Assertion.addMethod('decl', function(target) {
        let rule = utils.flag(this, 'rule')

        if (!rule) {
            throw Error('`decl` should be in the method chain after `rule`')
        } else if (!target) {
            throw Error('`decl` should declare target value')
        }

        let tmp = {}
        rule.walkDecls(decl => {
            let {prop, value} = decl
            tmp[prop] = value
        })

        Object.keys(target).forEach(p => {
            this.assert(
                target[p] === tmp[p],
                `expect ${p} to be ${target[p]} but get ${tmp[p]}`
            )
        })
    })

    Assertion.addProperty('exist', function() {
        let path = utils.flag(this, 'object')
        let flag = false

        try {
            fs.statSync(path)
            flag = true
        } catch (e) {}

        this.assert(
            flag,
            'expect #{this} to be exist but miss',
            'expect #{this} to be miss but exist'
        )
    })
}
