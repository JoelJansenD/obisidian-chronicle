import DEFAULT_SETTINGS from "./default_settings";
import deleteCalendarWithId from "./delete_calendar_with_id";
import { ChronicleSettings } from "./obsidian_chronicle_settings";

describe('deleteCalendarWithId', () => {

    let settings: ChronicleSettings;
    beforeEach(() => {
        settings = { 
            ...DEFAULT_SETTINGS, 
            calendars: [ 
                { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'calendar', colour: '#ffffff', directory: 'test' },
                { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'calendar2', colour: '#ffffff', directory: 'test2' },
            ]
        };
    });

    it('deletes the calendar when found', () => {
        // Arrange
        const targetId = settings.calendars[0].id;

        // Act
        deleteCalendarWithId(settings, targetId);

        // Assert
        expect(settings.calendars).toHaveLength(1);
        expect(settings.calendars[0].id).toBe('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
    });

    it('throws when no calendar with the given id is found', () => {
        // Arrange
        const targetId = 'this id does not exist';

        // Act & Assert
        expect(() => deleteCalendarWithId(settings, targetId)).toThrow(`No calendar found with ID '${targetId}'`);
        expect(settings.calendars).toHaveLength(2);
    });

});