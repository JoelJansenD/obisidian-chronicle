import { ChronicleCalendar } from "@src/settings/chronicle_settings";
import validateCalendar from "./validate_calendar";

describe('validateCalendar', () => {
    const validCalendars: ChronicleCalendar[] = [
        { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'calendar', colour: '#ffffff', directory: '/' },
        { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: '', colour: '#ffffff', directory: '/' },
        { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'calendar', colour: '', directory: '/' },
        { id: '', name: 'calendar', colour: '#ffffff', directory: '/' },
    ];

    test.each(validCalendars)('returns no validation problems when the calendar is valid', (calendar: ChronicleCalendar) => {
        // Act
        const result = validateCalendar(calendar);

        // Assert
        expect(result).toHaveLength(0);
    });

    it('returns a validation problem when the directory is empty', () => {
        // Arrange
        const calendar = { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'calendar', colour: '#ffffff', directory: '' };
        
        // Act
        const result = validateCalendar(calendar);

        // Assert
        expect(result).toHaveLength(1);
        expect(result[0]).toBe('You must select a directory to store notes');
    });
});