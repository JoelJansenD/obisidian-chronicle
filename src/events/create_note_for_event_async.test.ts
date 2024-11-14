import { ChronicleFullCalendar } from "@src/calendars/chronicle_calendar";
import createNoteForEventAsync from "./create_note_for_event_async";
import { App } from "obsidian";

describe('createNoteForEventAsync', () => {
    it('writes a full note with corresponding frontmatter', async () => {
        // Arrange
        const app = new App();
        const calendar: ChronicleFullCalendar = {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            colour: '#ffffff',
            directory: '',
            name: 'test',
            type: 'full'
        };
        const title = calendar.name;
        const dates = { start: new Date(Date.now() - 360_000), end: new Date() };

        const createSpy = jest.spyOn(app.vault, 'create');

        // Act
        await createNoteForEventAsync(app, calendar, title, dates);

        // Assert
        expect(createSpy).toHaveBeenCalledTimes(1);
        const call = createSpy.mock.calls[0];
        expect(call[0]).toBe(`${calendar.directory}/${title}.md`);
        expect(call[1]).toContain(`calendarId: ${calendar.id}`);
        expect(call[1]).toContain(`start: ${dates.start.toISOString()}`);
        expect(call[1]).toContain(`end: ${dates.end.toISOString()}`);
    });
});