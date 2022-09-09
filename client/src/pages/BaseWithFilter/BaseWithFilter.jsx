import React, {Component} from "react";

import {PageTop} from "@components/Layout";

class BaseWithFilter extends Component {
    constructor(props) {
        super(props);

        const now = new Date()
        this.state = {filter: {year: now.getFullYear(), month: false, day: false, eventId: false, directionId: false}}
    }

    getFiltersList = () => {
        return ['date', 'directions', 'events']
    }

    /**
     * Кастомная кнопка рядом с кнопкой экспорта страницы
     */
    pageTopCustomBtn = () => {
        return ''
    }

    onChangeFilter = (filter) => {}

    setFilter = (filter) => {
        if(JSON.stringify(this.state.filter) === JSON.stringify(filter))
            return filter

        this.onChangeFilter(filter)

        this.setState({filter})
    }

    render() {
        const {filter} = this.state

        return (
            <div className="page">
                <PageTop
                    filter={filter}
                    filtersList={this.getFiltersList()}
                    filterChange={this.setFilter}
                    customBtn={this.pageTopCustomBtn()}/>

                {this.content()}
            </div>
        )
    }
}

export default BaseWithFilter
