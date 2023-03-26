import {Worker} from 'worker_threads'
import ext from 'execution-time'

let number = 10

let p = ext()
p.start()

for (let i = 1; i <= number; i++) {

    const dieSides = 6
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