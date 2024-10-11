import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import ICalendar from "./icalendar";

export default class FullCalendar implements ICalendar {

    private _container: HTMLDivElement;
    public get container() {
        return this._container;
    }

    private _calender: Calendar;
    public get calendar() {
        return this._calender;
    }


    constructor() {
        this._container = document.createElement('div') as HTMLDivElement;
        this._calender = new Calendar(this._container, {
            plugins: [ dayGridPlugin ],
            initialView: 'dayGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridWeek'
            }
        });
        this.calendar.render();
    }
}