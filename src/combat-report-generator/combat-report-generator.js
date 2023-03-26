import ext from 'execution-time'
import {Worker} from 'worker_threads'
import {DIE_SIZES, MAX_DICE_COUNT} from '../config.js'
import {promisify} from 'util'
import fs from 'fs'

let fsExists = promisify(fs.exists)

let atkMax = MAX_DICE_COUNT
let defMax = MAX_DICE_COUNT

let atkDieSizes = DIE_SIZES
let defDieSizes = DIE_SIZES

let queue = makeQueue({
    atkDieSizes,
    defDieSizes,
    atkMax,
    defMax,
})

runQueue({
    queue,
    skipExisting: false,
})

function runQueue({queue, skipExisting = true}) {

    queue.forEach(async ({ndxATK, ndxDEF}) => {

        let perf = ext()
        perf.start()

        let key = `${ndxATK} vs ${ndxDEF}`

        let file = `./public/generated/combat-reports/${ndxATK}-vs-${ndxDEF}.json`

        if (skipExisting) {
            let exists = await fsExists(file)
            if (exists) {
                return
            }
        }
        // count++
        //
        // if(count > 1){
        //     return
        // }
        // console.log('queuing ' + key)

        const worker = new Worker('./src/combat-report-generator/combat-report-worker.js', {
            workerData: {
                ndxATK, ndxDEF,
            },
        })

        worker.once('message', result => {
            console.log(`${key} message: ${result}`)
        })

        worker.on('error', error => {
            console.log(`${key} error: `, error)
        })

        worker.on('exit', exitCode => {
            if (exitCode !== 0) {
                console.log(`${key} exited with code: ${exitCode}`)
            }

            const results = perf.stop()
            console.log(key + ' completed : ' + results.preciseWords)
        })
    })
}

function makeQueue({
                       atkDieSizes,
                       defDieSizes,
                       atkMax,
                       defMax,
                   }) {
    let queue = []

    atkDieSizes.forEach((atkDieSize) => {
        defDieSizes.forEach((defDieSize) => {

            for (let a = 1; a <= atkMax; a++) {
                for (let d = 1; d <= defMax; d++) {

                    queue.push({
                        ndxATK: `${a}d${atkDieSize}`, ndxDEF: `${d}d${defDieSize}`,
                    })
                }
            }
        })
    })

    return queue
}
