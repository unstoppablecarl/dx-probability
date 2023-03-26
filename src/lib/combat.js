
export function combat(atkCombo, defCombo) {

    atkCombo = [].concat(atkCombo)
    defCombo = [].concat(defCombo)

    // should already be sorted and reversed
    let atk = atkCombo//.sort().reverse()
    let def = defCombo//.sort().reverse()

    // let debug = {}
    let successes = atk.length

    let blocks = 0

    // atk.forEach((a) => {
    //     debug[a] = 'success'
    // })

    const atkLen = atk.length
    const defLen = def.length
    let dIndex = 0

    for (let ai = 0; ai < atkLen; ai++) {
        if (dIndex > defLen) {
            break
        }

        let a = atk[ai]
        let d = def[dIndex]

        if (a <= d) {
            dIndex++
            // debug[a] = 'blocked by: ' + d
            successes--
            blocks++
        }
    }

    return Object.freeze({
        successes,
        blocks,
        // debug,
    })

}
