import DEFAULT_SETTINGS from "@src/settings/default_settings";
import { ChronicleCalendar, ChronicleSettings } from "@src/settings/chronicle_settings";
import addCalendar from "./add_calendar";

describe('addCalendar', () => {

    let settings: ChronicleSettings;
    beforeEach(() => {
        // Clear the calendars array on each run, otherwise added calendars from previous tests might interfere with new tests
        // Arrays are also passed as references, so spreading the settings object doesn't clear the array's reference
        settings = {...DEFAULT_SETTINGS, calendars: []};
    })

    it('stores a valid calendar in the given settings object', () => {
        // Arrange
        const newCalendar: ChronicleCalendar = { 
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
            name: 'calendar', 
            colour: '#ffffff', 
            directory: '/' ,
            type: 'full'
        };

        // Act & Assert
        expect(addCalendar(settings, newCalendar)).toBeFalsy();
        expect(settings.calendars).toHaveLength(1);
        expect(settings.calendars[0]).toBe(newCalendar);
    });
    
    it('returns all validation problems when given an invalid object', () => {
        // Arrange
        const newCalendar: ChronicleCalendar = { 
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
            name: 'calendar', 
            colour: '#ffffff', 
            directory: '' ,
            type: 'full'
        };

        // Act 
        const result = addCalendar(settings, newCalendar);

        // Assert
        expect(result).toHaveLength(1);
        expect(result![0]).toBe('You must select a directory to store notes');
        expect(settings.calendars).toHaveLength(0);
    });
});