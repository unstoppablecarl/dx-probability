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
            let key = slugify(newCombo)
            if (cache[key]) {
                return
            }

            cache[key] = true
            results.push(newCombo)
        })
    })

    return results
}

function slugify(arr) {
    arr = arr.sort()

    return arr.join('-')
}