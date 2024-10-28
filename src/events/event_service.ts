import { CalendarApi, EventInput } from "@fullcalendar/core";

export default class EventService {
    createEvent(calendar: CalendarApi, eventInput: EventInput) {
        return calendar.addEvent(eventInput);
    }
}