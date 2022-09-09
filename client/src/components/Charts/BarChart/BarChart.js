import React from "react"
import {Bar} from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

/**
 *
 * @param {[{label: string, value: number}]} data
 * @return {{chartOptions: {}, chartData: {}}}
 */
const initChart = (data) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend)

    const props = {
        chartOptions: {},
        chartData: {
            labels: [],
            datasets: [
                {
                    yAxisID: 'yAxis',
                    xAxisID: 'xAxis',
                    label: 'Users',
                    minBarLength: 5,
                    borderRadius: 10,
                    backgroundColor: ['#3361FF', '#EDEFF2', '#EDEFF2', '#EDEFF2', '#EDEFF2'],
                    data: []
                }
            ]
        }
    }

    props.chartOptions = {
        responsive: true,
        // maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                intersect: false,
                position: 'nearest',
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || ''

                        if (label) {
                            label += ': '
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + '%'
                        }
                        return label
                    }
                }
            }
        },
        scales: {
            yAxis: {
                min: 0,
                max: 100,
                ticks: {
                    callback: function (value, index, values) {
                        return value + '%'
                    },
                },
                display: false,
            },
            xAxis: {
                grid: {
                    display:false
                },
                ticks: {
                    font: {
                        size: 10
                    }
                }
            }
        }
    }

    if(!data)
        return props

    if(data && data.length) {
        props.chartData.labels = data.map(({label}) => label)
        props.chartData.datasets[0].data = data.map(({value}) => value)
    }

    return props
}

const BarChart = (props) => {
    const {data} = props

    const {chartOptions, chartData} = initChart(data)

    return <Bar options={chartOptions} data={chartData} />
}

export default BarChart
