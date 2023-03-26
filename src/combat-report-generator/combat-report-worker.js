import {writeReport} from '../lib/combat-report.js'
import {parentPort, workerData} from 'worker_threads'

let {ndxATK, ndxDEF} = workerData

parentPort.postMessage(`starting: ${ndxATK} vs ${ndxDEF}`)

writeReport(ndxATK, ndxDEF)
