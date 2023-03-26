import {parentPort, workerData} from 'worker_threads'
import {makeCombos} from '../lib/generate-combos.js'
import fs from 'fs'

let {dieCount, dieSides} = workerData

let xdn = `${dieCount}d${dieSides}`

parentPort.postMessage('starting: ' + xdn)

generateCache(dieCount, dieSides)

function generateCache(dieCount, dieSides) {

    let dieSidesArr = dieSidesToArr(dieSides)

    let nd6 = makeCombos(dieSidesArr, dieCount)
    let contents = JSON.stringify(nd6)

    fs.promises.writeFile(`./public/generated/combos/${dieCount}d${dieSides}.json`, contents)
}

function dieSidesToArr(dieSides) {
    let dieSidesArr = []
    for (let i = 1; i <= dieSides; i++) {
        dieSidesArr.push(i)
    }
    return dieSidesArr
}