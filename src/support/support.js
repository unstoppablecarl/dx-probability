export function _each(obj, callback) {
    Object.keys(obj).forEach((k) => {
        let v = obj[k]
        callback(v, k)
    })
}

export function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}