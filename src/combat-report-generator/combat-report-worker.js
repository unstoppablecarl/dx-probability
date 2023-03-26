import {calcReport} from '../lib/combat-report.js'
import fs from 'fs'
import {parentPort, workerData} from 'worker_threads'

let {ndxATK, ndxDEF} = workerData

parentPort.postMessage(`starting: ${ndxATK} vs ${ndxDEF}`)

let report = calcReport(ndxATK, ndxDEF)

let content = JSON.stringify(report)
let file = `./public/generated/combat-reports/${ndxATK}-vs-${ndxDEF}.json`

fs.promises.writeFile(file, content)