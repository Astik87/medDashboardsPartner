import React from "react";

import {LineChart} from "@components/Charts";

/**
 * Получить массив планов для графика
 * @param {[{name: string, plan: number, fact: number}]} plans массив планов
 * @return {({data: [number], options: {borderColor: string, label: string}}|{data: [number], options: {borderColor: string, backgroundColor: (function(*): *), label: string}})[]}
 */
function getPlansDataForChart(plans) {
    const plansData = plans.map(({plan, name}) => ({label: name, value: plan}))
    const factData = plans.map(({fact, name}) => ({label: name, value: fact}))

    const plansDatasetOptions = {
        borderColor: '#3361FF',
        label: 'Plan',
        backgroundColor: function (context) {
            const chart = context.chart
            const {ctx, chartArea} = chart

            if (!chartArea)
                return

            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
            gradient.addColorStop(0, 'rgba(51, 97, 255, 0)')
            gradient.addColorStop(0.5, 'rgba(51, 97, 255, 0.10)')

            return gradient
        },
    }

    const factDatasetOptions = {
        borderColor: '#34C759',
        label: 'Fact',
        backgroundColor: function (context) {
            const chart = context.chart
            const {ctx, chartArea} = chart

            if (!chartArea)
                return

            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
            gradient.addColorStop(0, 'rgba(96, 255, 136, 0)')
            gradient.addColorStop(0.5, 'rgba(52, 199, 89, 0.10)')

            return gradient
        },
    }

    return [{options: plansDatasetOptions, data: plansData}, {options: factDatasetOptions, data: factData}]
}

const PlansChart = (props) => {
    const {plans} = props

    return <LineChart datasets={getPlansDataForChart(plans)}/>
}

export default PlansChart
