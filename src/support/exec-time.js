import ext from 'execution-time'

let perf = ext()

export function execTime(name, callback) {

    perf.start()
    callback()

    const results = perf.stop()
    console.log(name + ': ' + results.preciseWords)
}