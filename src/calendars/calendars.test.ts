import { ChronicleSettings } from '@src/settings/obsidian_chronicle_settings';
import { getCalendarById, getCalendars } from './calendars';
import { Guid } from 'guid-typescript';

describe('getCalendars', () => {
    it('should return all calendars', () => {
        // Arrange
        const config : ChronicleSettings = {
            calendars: [
                {
                    id: Guid.raw(),
                    colour: '#ffffff',
                    directory: '',
                    name: 'cal1'
                },
                {
                    id: Guid.raw(),
                    colour: '#ffffff',
                    directory: '',
                    name: 'cal2'
                },
            ]
        };

        // Act
        const result = getCalendars(config);

        // Assert
        expect(result).toEqual(config.calendars);
    });
    
    it('should return empty array when no calendars are known', () => {
        // Arrange
        const config : ChronicleSettings = { calendars: [] };

        // Act
        const result = getCalendars(config);

        // Assert
        expect(result).toEqual([]);
    });
});

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