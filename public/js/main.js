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

    let {datasets, labels} = await Promise.all(
        promises.map(async ({atk, def}) => {
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

            let successOrHigher = {}

            let prev = 0
            Object.keys(json.successPercent).sort().reverse()
                .forEach((key) => {
                    let val = parseFloat(json.successPercent[key])

                    successOrHigher[key] = (val + prev) * 100

                    prev += val
                })

            datasets.push({
                label: `${atk}d6 vs ${def}d6`,
                data: successOrHigher,
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
                labels,
                datasets,
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            title(tooltipItems) {
                                let title = ''

                                if (tooltipItems.length > 0) {
                                    const item = tooltipItems[0]
                                    const labels = item.chart.data.labels
                                    const labelCount = labels ? labels.length : 0

                                    if (this && this.options && this.options.mode === 'dataset') {
                                        title = item.dataset.label || ''
                                    } else if (item.label) {
                                        title = item.label
                                    } else if (labelCount > 0 && item.dataIndex < labelCount) {
                                        title = labels[item.dataIndex]
                                    }
                                }

                                return `${title} or more successes`
                            },
                            label(tooltipItem) {
                                let label = tooltipItem.dataset.label || ''

                                if (label) {
                                    label += ': '
                                }
                                const value = tooltipItem.formattedValue

                                if (value !== null && value !== undefined) {

                                    label += value + '%'
                                }

                                return label
                            },
                        },
                    },
                },
            },
        },
    )
})()