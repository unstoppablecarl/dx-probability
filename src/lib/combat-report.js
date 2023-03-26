import {combat} from './combat.js'
import {createRequire} from 'module'
import chalk from 'chalk'
import {_each, round} from '../support/support.js'

const require = createRequire(import.meta.url)

export function logReport(ndxATK, ndxDEF) {

    let report = calcReport(ndxATK, ndxDEF)

    let {successPercent} = report

    console.log()
    console.log(chalk.blueBright('Attacker ') + 'rolls: ' + chalk.green(ndxATK))
    console.log(chalk.red('Defender ') + 'rolls: ' + chalk.green(ndxDEF))
    console.log()

    console.log(chalk.cyan('Attacker results:'))

    let percentTotal = 0
    _each(successPercent, (val, key) => {

        let percentRounded = round(val * 100, 2)

        let msg = chalk.white(`successes: x${key}: `)
        msg += chalk.green(`${percentRounded}%`)

        percentTotal += val * 100

        console.log(msg)
    })

    console.log('percent total: ' + chalk.green(percentTotal))
}

export function calcReport(ndxATK, ndxDEF) {

    const atkCombos = require(`../../public/generated/combos/${ndxATK}.json`)
    const defCombos = require(`../../public/generated/combos/${ndxDEF}.json`)

    return combatReport(atkCombos, defCombos)
}

export function combatReport(atkCombos, defCombos) {

    const successMap = {}
    const blockMap = {}

    atkCombos.forEach((atk) => {
        defCombos.forEach((def) => {
            let {
                successes,
                blocks,
                debug,
            } = combat(atk, def)

            if (!successMap[successes]) {
                successMap[successes] = 0
            }

            if (!blockMap[blocks]) {
                blockMap[blocks] = 0
            }

            blockMap[blocks]++
            successMap[successes]++

        })
    })

    let successMapSum = _sum(Object.values(successMap))
    let blockMapSum = _sum(Object.values(blockMap))

    let successPercent = {}

    Object.keys(successMap).forEach((k) => {
        let v = successMap[k]
        successPercent[k] = (v / successMapSum).toFixed(2)
    })

    return {
        successMap,
        successMapSum,
        successPercent,
        blockMap,
        blockMapSum,
    }
}

function _sum(arr) {
    let sum = 0
    arr.forEach((v) => sum += v)
    return sum
}