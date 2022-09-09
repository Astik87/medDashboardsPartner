import {makeAutoObservable} from "mobx";
import DirectionsApi from "../api/DirectionsApi";
import EventsApi from "../api/EventsApi";

export default class FilterState {
    constructor() {
        this._directionsList = false
        this._eventsList = false

        makeAutoObservable(this)
    }

    setDirectionsList(directions) {
        this._directionsList = directions
    }

    setEventsList(events) {
        this._eventsList = events
    }

    get directionsList() {
        if(this._directionsList === false)
            DirectionsApi.getAll().then(directions => {
                this.setDirectionsList(directions)
            })

        return this._directionsList
    }

    get eventsList() {
        if(this._eventsList === false)
            EventsApi.getAll().then(events => {
                this.setEventsList(events)
            })

        return this._eventsList
    }
}
