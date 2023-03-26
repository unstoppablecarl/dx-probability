export function makeCombos(choices, count) {
    return combinations(choices, count)
}

function combinations(choices, n = 1, cache = {}) {

    if (n === 0) {
        return [[]]
    }

    let combos = combinations(choices, n - 1, cache)

    let results = []

    combos.forEach((combo) => {
        choices.forEach((choice) => {
            let newCombo = [choice].concat(combo)

            newCombo.sort().reverse()

            let key = newCombo.join('-')

            if (cache[key]) {
                return
            }

            cache[key] = true
            results.push(newCombo)
        })
    })

    return results
}