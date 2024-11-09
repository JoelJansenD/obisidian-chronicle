import { CalendarApi, EventInput } from "@fullcalendar/core";

export function createEvent(calendar: CalendarApi, eventInput: EventInput) {
    return calendar.addEvent(eventInput);
}