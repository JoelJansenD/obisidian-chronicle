import DEFAULT_SETTINGS from "@src/settings/default_settings";
import { ChronicleSettings } from "@src/settings/chronicle_settings";
import addCalendar, { CreateCalendarDto } from "./add_calendar";
import { ChronicleDailyCalendar, ChronicleFullCalendar } from "@src/calendars/chronicle_calendar";

describe('addCalendar', () => {

    let settings: ChronicleSettings;
    beforeEach(() => {
        // Clear the calendars array on each run, otherwise added calendars from previous tests might interfere with new tests
        // Arrays are also passed as references, so spreading the settings object doesn't clear the array's reference
        settings = {...DEFAULT_SETTINGS, calendars: []};
    });

    it('creates a full calendar for type "full"', () => {
        // Arrange
        const input: CreateCalendarDto = {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            name: 'test',
            colour: '#ffffff',
            type: 'full',
            directory: '/'
        };

        // Act
        const result = addCalendar(settings, input) as ChronicleFullCalendar;

        // Assert
        expect(result).toStrictEqual(input);
    });

    it('throws when input not valid for type "full"', () => {
        // Arrange
        const input: CreateCalendarDto = {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            name: 'test',
            colour: '#ffffff',
            type: 'full',
            directory: undefined
        };

        // Act & Assert
        expect(() => addCalendar(settings, input)).toThrow('Directory must have a value for full calendars');
    });

    it('creates a daily calendar for type "daily"', () => {
        // Arrange
        const input: CreateCalendarDto = {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            name: 'test',
            colour: '#ffffff',
            type: 'daily',
            header: '# test'
        };

        // Act
        const result = addCalendar(settings, input) as ChronicleDailyCalendar;

        // Assert
        expect(result).toStrictEqual(input);
    });

    it('throws when input not valid for type "daily"', () => {
        // Arrange
        const input: CreateCalendarDto = {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            name: 'test',
            colour: '#ffffff',
            type: 'daily',
            header: undefined
        };

        // Act & Assert
        expect(() => addCalendar(settings, input)).toThrow('Header must have a value for daily calendars');
    });

    it('throws when type is empty', () => {
        // Arrange
        const input: CreateCalendarDto = {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            name: 'test',
            colour: '#ffffff',
            type: ''
        };

        // Act & Assert
        expect(() => addCalendar(settings, input)).toThrow('Calendar type \'\' is not supported');
    });
});