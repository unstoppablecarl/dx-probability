(async function () {
    const params = new URLSearchParams(document.location.search)

    let xdnATK = params.get('atk')
    let xdnDEF = params.get('def')

    let response = await fetch(`/generated/combat-reports/${xdnATK}-vs-${xdnDEF}.json`)
    let json = await response.json()

    let datasets = []
    let labels = []

    let successOrHigher = {}

    let prev = 0
    Object.keys(json.successPercent).sort().reverse()
        .forEach((key) => {
            let val = parseFloat(json.successPercent[key])

            successOrHigher[key] = (val + prev) * 100

            prev += val
        })

    datasets.push({
        label: `${xdnATK} vs ${xdnDEF}`,
        data: successOrHigher,
    })

    labels = Object.keys(json.successPercent)

    let container = document.getElementById('chart-container')
    let canvas = document.createElement('canvas')
    container.append(canvas)

    new Chart(
        canvas,
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

                                return `roll >= ${title}`
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