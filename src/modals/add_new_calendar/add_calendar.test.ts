import DEFAULT_SETTINGS from "@src/settings/default_settings";
import { ChronicleSettings } from "@src/settings/chronicle_settings";
import addCalendar from "./add_calendar";
import { ChronicleFullCalendar } from "@src/calendars/chronicle_calendar";

describe('addCalendar', () => {

    let settings: ChronicleSettings;
    beforeEach(() => {
        // Clear the calendars array on each run, otherwise added calendars from previous tests might interfere with new tests
        // Arrays are also passed as references, so spreading the settings object doesn't clear the array's reference
        settings = {...DEFAULT_SETTINGS, calendars: []};
    })

    it('stores a valid calendar in the given settings object', () => {
        // Arrange
        const newCalendar: ChronicleFullCalendar = { 
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
            name: 'calendar', 
            colour: '#ffffff', 
            directory: '/' ,
            type: 'full'
        };

        // Act
        const result = addCalendar(settings, newCalendar);

        // Assert
        expect(result).not.toBeNull();
        expect(settings.calendars).toHaveLength(1);
        expect(settings.calendars[0]).toBe(result);
    });
    
    it('returns all validation problems when given an invalid object', () => {
        // Arrange
        const newCalendar: ChronicleFullCalendar = { 
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
            name: 'calendar', 
            colour: '#ffffff', 
            directory: '' ,
            type: 'full'
        };

        // Act & Assert 
        expect(() => addCalendar(settings, newCalendar)).toThrow('Directory must have a value for full calendars');
        expect(settings.calendars).toHaveLength(0);
    });
});