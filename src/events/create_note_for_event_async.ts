import { ChronicleCalendar, ChronicleDailyCalendar, ChronicleFullCalendar } from "@src/calendars/chronicle_calendar";

export default async function createNoteForEventAsync(calendar: ChronicleCalendar, title: string, span: { start: Date, end: Date }) {
    switch(calendar.type) {
        case "full":
            await createFullNoteForEventAsync(calendar as ChronicleFullCalendar, title, span);
            break;
        case "daily":
            await createDailyNoteForEventAsync(calendar as ChronicleDailyCalendar, title, span);
            break;
        default:
            throw `Calendar type '' is not supported ${calendar.type}`;
    }
}

async function createDailyNoteForEventAsync(calendar: ChronicleDailyCalendar, title: string, span: { start: Date, end: Date }) {

}

async function createFullNoteForEventAsync(calendar: ChronicleFullCalendar, title: string, span: { start: Date, end: Date }) {
    let content = `---
    calendarId: ${ calendar.id }
    start: ${ span.start.toISOString() }
    end: ${span.end.toISOString() }
    ---`;
    await this.app.vault.create(`${(calendar as ChronicleFullCalendar).directory}/${title}.md`, content);
}