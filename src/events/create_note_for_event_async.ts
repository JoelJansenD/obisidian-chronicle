import { ChronicleCalendar, ChronicleDailyCalendar, ChronicleFullCalendar } from "@src/calendars/chronicle_calendar";
import { App } from "obsidian";

export default async function createNoteForEventAsync(app: App, calendar: ChronicleCalendar, title: string, span: { start: Date, end: Date }) {
    switch(calendar.type) {
        case "full":
            await createFullNoteForEventAsync(app, calendar as ChronicleFullCalendar, title, span);
            break;
        case "daily":
            await createDailyNoteForEventAsync(app, calendar as ChronicleDailyCalendar, title, span);
            break;
        default:
            throw `Calendar type '${calendar.type}' is not supported`;
    }
}

async function createDailyNoteForEventAsync(app: App, calendar: ChronicleDailyCalendar, title: string, span: { start: Date, end: Date }) {

}

async function createFullNoteForEventAsync(app: App, calendar: ChronicleFullCalendar, title: string, span: { start: Date, end: Date }) {
    let content = `---
    calendarId: ${ calendar.id }
    start: ${ span.start.toISOString() }
    end: ${span.end.toISOString() }
    ---`;
    await app.vault.create(`${calendar.directory}/${title}.md`, content);
}