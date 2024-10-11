import Calendar from '@event-calendar/core';
import TimeGrid from '@event-calendar/time-grid';
import Interaction from '@event-calendar/interaction';
import ICalendar from "./icalendar";
import '@event-calendar/core/index.css';
import { ItemView } from 'obsidian';

export default class EventCalender implements ICalendar {
    
    private _container: HTMLDivElement;
    public get container() {
        return this._container;
    }

    constructor(view: ItemView) {
        this._container = document.createElement('div');
        const calendar = new Calendar({
            target: this.container,
            props: {
                plugins: [ TimeGrid, Interaction ],
                options: {
                    allDayContent: { html: '' },
                    dayHeaderFormat: d => this.formatHeader(d, view.containerEl.offsetWidth),
                    dateClick: info => {
                        console.log(info)
                    },
                    eventDragStart: info => {
                        console.log(info)
                    },
                    events: [],
                    locale: 'nl',
                    nowIndicator: true,
                    slotLabelFormat: { hour: '2-digit', minute: '2-digit' },
                    titleFormat: d => {
                        const month = d.toLocaleDateString('nl', { month: 'long' });
                        return `${month[0].toUpperCase()}${month.substring(1)}`
                    },
                    view: 'timeGridWeek',
                }
            }
        });   
    }

    dateClick(info : object) {
        console.log(info);
    }

    private formatHeader(date: Date, width: number) {
        const dayAbb = date.toLocaleDateString('nl', { weekday: 'long' });
        return {
            html: `<div class='cv-day'>
                       <span>${dayAbb[0].toUpperCase()}${(width > 768 ? dayAbb.substring(1) : '')}</span>
                       <span>${date.getDate()}</span>
                   </div>`
        };
    }
}