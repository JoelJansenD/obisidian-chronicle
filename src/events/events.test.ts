import { Calendar, EventInput } from '@fullcalendar/core';
import dayGridPlugin from "@fullcalendar/daygrid";
import { JSDOM } from 'jsdom';
import { createEvent } from './events';

declare global {
    namespace NodeJS {
        interface Global {
            document: Document;
            window: Window;
            navigator: Navigator;
        }
    }
}

describe('createEvent', () => {

    beforeAll(() => {
        const window = new JSDOM('<!doctype html><html><body></body></html>').window;
        global.document = window.document;
        global.window = global.document.defaultView!;
    })

    let calendarEl: HTMLElement;
    let calendar: Calendar;
    beforeEach(() => {
        calendarEl = global.document.createElement('div');
        calendar = new Calendar(calendarEl, {
            plugins: [ dayGridPlugin ],
            initialView: 'dayGridMonth',
        });
    });

    it('creates event', () => {
        // Arrange
        const startDate = new Date();
        startDate.setMilliseconds(0); // FullCalendar removes millis from the timestamp

        const endDate = new Date(Date.now() + 360_000); // Add an hour (360.000 milliseconds) to the end date
        endDate.setMilliseconds(0);

        const event: EventInput = {
            title: 'test event',
            start: startDate,
            end: endDate,
        };

        // Act
        const result = createEvent(calendar, event);

        // Assert
        expect(result?.title).toEqual(event.title);
        expect(result?.start?.getTime()).toEqual(startDate.getTime());
        expect(result?.end?.getTime()).toEqual(endDate.getTime());
    });
});