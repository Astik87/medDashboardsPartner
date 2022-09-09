import React from "react";
import {Line} from "react-chartjs-2"
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Filler,
    Tooltip
} from "chart.js";

const defaultDataOptions = {
    yAxisID: 'yAxis',
    xAxisID: 'xAxis',
    label: 'Users',
    backgroundColor: function (context) {
        const chart = context.chart
        const {ctx, chartArea} = chart

        if (!chartArea)
            return

        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
        gradient.addColorStop(0, 'rgba(51, 97, 255, 0)')
        gradient.addColorStop(0.5, 'rgba(51, 97, 255, 0.19)')

        return gradient
    },
    cubicInterpolationMode: 'monotone',
    borderColor: '#3361FF',
    fill: true,
}

const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            intersect: false,
            position: 'nearest',
        }
    },
    scales: {
        yAxis: {
            position: 'right'
        },
        xAxis: {
            grid: {
                display: false
            }
        }
    }
}

const getData = (data) => {
    let labels = []
    let resultData = []

    if (data && data.length) {
        labels = data.map(({label}) => label)
        resultData = data.map(({value}) => value)
    }

    return {labels, data: resultData}
}

/**
 *
 * @param {[{label: string, value: number}]} datasets
 * @return {{chartOptions: {}, chartData: {}}}
 */
const initChart = (datasets) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Filler,
        Legend
    );

    const props = {
        chartOptions: {},
        chartData: {
            labels: [],
            datasets: []
        }
    }

    props.chartOptions = defaultChartOptions

    if (!datasets || !datasets.length)
        return props

    datasets = datasets.map((oneData) => {
        const {data, labels} = getData(oneData.data)

        return {
            ...defaultDataOptions,
            ...oneData.options,
            labels,
            data
        }
    })

    props.chartData.labels = datasets[0].labels
    props.chartData.datasets = datasets

    return props
}

const LineChart = (props) => {
    const {datasets} = props

    const {chartOptions, chartData} = initChart(datasets)

    return <Line options={chartOptions} data={chartData}/>
}

export default LineChart
