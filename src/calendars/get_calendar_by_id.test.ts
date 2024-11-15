import { ChronicleSettings } from '@src/settings/chronicle_settings';
import { getCalendarById } from './get_calendar_by_id';
import { Guid } from 'guid-typescript';
import { ChronicleFullCalendar } from './chronicle_calendar';

describe('getCalendarById', () => {
    it('should return the calendar with the given id', () => {
        // Arrange
        const target: ChronicleFullCalendar = { id: Guid.raw(), name: 'target', colour: '#ffffff', directory: '', type: 'full' }
        const config: ChronicleSettings = { 
            calendars: [
                { id: Guid.raw(), name: 'target', colour: '#ffffff', directory: '', type: 'full' },
                target,
                { id: Guid.raw(), name: 'target', colour: '#ffffff', directory: '', type: 'full' }
            ]
        };

        // Act
        const result = getCalendarById(config, target.id);

        // Assert
        expect(result).toBe(target);
    });
    
    it('should return null when no calendar is found', () => {
        // Arrange
        const config: ChronicleSettings = { 
            calendars: [
                { id: Guid.raw(), name: 'target', colour: '#ffffff', type: 'full' },
                { id: Guid.raw(), name: 'target', colour: '#ffffff', type: 'full' }
            ]
        };

        // Act
        const result = getCalendarById(config, Guid.raw());

        // Assert
        expect(result).toBeNull();
    });
});