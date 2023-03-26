import ext from 'execution-time'
import {Worker} from 'worker_threads'

let atkMax = 10
let defMax = 10

for (let a = 1; a <= atkMax; a++) {
    for (let d = 1; d <= defMax; d++) {

        let perf = ext()
        perf.start()

        let ndxATK = `${a}d6`
        let ndxDEF = `${d}d6`

        let key = `${ndxATK} vs ${ndxDEF}`

        const worker = new Worker('./src/combat-report-generator/combat-report-worker.js', {
            workerData: {
                ndxATK,
                ndxDEF,
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
    }
}
