export function combat(atkCombo, defCombo) {

    atkCombo = [].concat(atkCombo)
    defCombo = [].concat(defCombo)

    let atk = atkCombo.sort().reverse()
    let def = defCombo.sort().reverse()

    let debug = {}
    let successes = atk.length

    let blocks = 0

    atk.forEach((a) => {
        debug[a] = 'success'

    })

    atk.forEach((a) => {
        if (!def.length) {
            return
        }

        let d = def[0]

        if (a <= d) {
            def.shift()
            debug[a] = 'blocked by: ' + d
            successes--
            blocks++
        }
    })

    return Object.freeze({
        successes,
        blocks,
        debug,
    })

}
