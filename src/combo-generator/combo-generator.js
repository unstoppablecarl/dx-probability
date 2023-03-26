import {Worker} from 'worker_threads'
import ext from 'execution-time'
import {DIE_SIZES, MAX_DICE_COUNT} from '../config.js'

let p = ext()
p.start()

DIE_SIZES.forEach((dieSides) => {

    for (let i = 1; i <= MAX_DICE_COUNT; i++) {

        const dieCount = i
        let xdn = `${dieCount}d${dieSides}`
        let perf = ext()
        perf.start()
        const worker = new Worker('./src/combo-generator/combo-worker.js', {
            workerData: {
                dieSides,
                dieCount,
            },
        })

        worker.once('message', result => {
            console.log(`${xdn} message: ${result}`)
        })

        worker.on('error', error => {
            console.log(`${xdn} error: `, error)
        })

        worker.on('exit', exitCode => {
            if (exitCode !== 0) {
                console.log(`${xdn} exited with code: ${exitCode}`)
            }

            const results = perf.stop()
            console.log(xdn + ' completed : ' + results.preciseWords)
        })
    }

})