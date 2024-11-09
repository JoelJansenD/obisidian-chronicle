import { getCalendarById } from './get_calendar_by_id';
import { Guid } from 'guid-typescript';

describe('getCalendarById', () => {
    it('should return the calendar with the given id', () => {
        // Arrange
        const target = { id: Guid.raw(), name: 'target', colour: '#ffffff', directory: '' }
        const config = { 
            calendars: [
                { id: Guid.raw(), name: 'target', colour: '#ffffff', directory: '' },
                target,
                { id: Guid.raw(), name: 'target', colour: '#ffffff', directory: '' }
            ]
        };

        // Act
        const result = getCalendarById(config, target.id);

        // Assert
        expect(result).toBe(target);
    });
    
    it('should return null when no calendar is found', () => {
        // Arrange
        const config = { 
            calendars: [
                { id: Guid.raw(), name: 'target', colour: '#ffffff', directory: '' },
                { id: Guid.raw(), name: 'target', colour: '#ffffff', directory: '' }
            ]
        };

        // Act
        const result = getCalendarById(config, Guid.raw());

        // Assert
        expect(result).toBeNull();
    });
});