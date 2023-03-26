(async function () {

    let max = 5

    let repeat = []
    for (let i = 1; i <= max; i++) {
        repeat.push(i)
    }

    let promises = []

    repeat.forEach((atk) => {
        repeat.forEach((def) => {
            promises.push({atk, def})
        })
    })

    promises = [{
        atk: 3,
        def: 3,
    }]
    let {datasets, labels} = await Promise.all(
        promises.map(async ({atk, def}) => {
            console.log(atk, def)
            let response = await fetch(`/generated/combat-reports/${atk}d6-vs-${def}d6.json`)
            let json = await response.json()

            return {
                atk,
                def,
                json,
            }
        }),
    ).then((...results) => {

        let datasets = []
        let labels = []
        for (let i = 0; i < results[0].length; i++) {
            let {atk, def, json} = results[0][i]
            console.log(json)
            datasets.push({
                label: atk + ' vs ' + def,
                data: json.successPercent,
            })

            labels = Object.keys(json.successPercent)
        }

        return {
            datasets,
            labels,
        }

    })

    new Chart(
        document.getElementById('chart'),
        {
            type: 'line',
            data: {
                // labels: data.map(row => row.successCount),
                labels,
                // datasets: [
                //     {
                //         label: '1d6 vs 1d6',
                //         data: data.map(row => row.percent),
                //     },
                // ],
                datasets,
            },
        },
    )
})()