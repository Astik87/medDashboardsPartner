import React from "react"
import Select from "react-select"

const getYearOptions = (now) => {
    const yearOptions = []

    for(let year = 2020; year <= now.getFullYear() + 2; year++)
        yearOptions.push({value: year, label: year})

    return yearOptions
}

const getMonthOptions = (now, currentYear) => {
    const monthOptions = []

    let maxMonth = 12

    if(now.getFullYear() === currentYear)
        maxMonth = now.getMonth()+1

    for(let month = 1; month <= maxMonth; month++)
        monthOptions.push({value: month, label: month})

    return monthOptions
}

const getDayOptions = (now, currentYear, currentMonth) => {
    const dayOptions = []

    let maxDay = new Date(currentYear, currentMonth, 0).getDate()

    if(currentYear === now.getFullYear() && currentMonth === now.getMonth()+1)
        maxDay = now.getDate()

    for(let day = 1; day <= maxDay; day++)
        dayOptions.push({value: day, label: day})

    return dayOptions
}

const DateFilter = (props) => {
    const {filter, change} = props

    const now  = new Date()

    const {year, month, day} = filter

    const yearOptions = getYearOptions(now),
        monthOptions = getMonthOptions(now, year),
        dayOptions = getDayOptions(now, year, month)

    const setYear = ({value}) => change({year: value, month: month, day: day})
    const setMonth = (option) => change({year: year, month: !option ? false : option.value, day: !option ? false : day})
    const setDay = (option) => change({year: year, month: month, day: !option ? false : option.value})

    return (
        <div className="date-filter">
            <Select
                onChange={setYear}
                defaultValue={yearOptions.length-1}
                value={{value: year, label: year}}
                options={yearOptions}
                classNamePrefix="filter"
                className="filter-select"
                isSearchable={false}
            />
            <Select
                onChange={setMonth}
                placeholder="Месяц"
                options={monthOptions}
                value={month ? {value: month, label: month} : false}
                classNamePrefix="filter"
                className="filter-select"
                isClearable={true}
                isSearchable={false}
            />
            {month && <Select
                onChange={setDay}
                placeholder="День"
                options={dayOptions}
                value={day ? {value: day, label: day} : false}
                classNamePrefix="filter"
                className="filter-select"
                isClearable={true}
                isSearchable={false}
            />}
        </div>
    )
}

export default DateFilter
