import { ChronicleCalendar, ChronicleSettings } from "./chronicle_settings";

export default function deleteCalendarWithId(settings: ChronicleSettings, id: string) {
    const calendarIdx = settings.calendars.findIndex(c => c.id === id);
    if(calendarIdx === -1) {
        throw `No calendar found with ID '${id}'`;
    }
    settings.calendars.splice(calendarIdx, 1);
}