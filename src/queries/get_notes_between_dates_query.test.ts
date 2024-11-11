import { QueryFilesInput } from "@src/notes/query_files_async";
import getNotesBetweenDatesQuery from "./get_notes_between_dates_query";
import { TFile } from "obsidian";

const HOUR_IN_MILLIS = 3_600_000;
describe('getNotesBetweenDatesQuery', () => {
    it('returns false when event end lies before query start date', () => {
        // Arrange
        const query: QueryFilesInput = { 
            file: new TFile(), 
            frontmatter: { 
                start: new Date(Date.now() - (HOUR_IN_MILLIS * 10)),
                end: new Date(Date.now() - (HOUR_IN_MILLIS * 9)),
            }
        };

        const start = new Date(Date.now() - (HOUR_IN_MILLIS * 8));
        const end = new Date();

        // Act
        const result = getNotesBetweenDatesQuery(query, start, end);

        // Assert
        expect(result).toBe(false);
    });

    it('returns false when event start lies after query end date', () => {
        // Arrange
        const query: QueryFilesInput = { 
            file: new TFile(), 
            frontmatter: { 
                start: new Date(),
                end: new Date(Date.now() + (HOUR_IN_MILLIS)),
            }
        };

        const start = new Date(Date.now() - (HOUR_IN_MILLIS * 8));
        const end = new Date(Date.now() - (HOUR_IN_MILLIS * 7));

        // Act
        const result = getNotesBetweenDatesQuery(query, start, end);

        // Assert
        expect(result).toBe(false);
    });

    test.each([[new Date(), undefined], [undefined, new Date()]])
    ('returns false when the query input has no start or end', (startInput?: Date, endInput?: Date) => {
        // Arrange
        const query: QueryFilesInput = { 
            file: new TFile(), 
            frontmatter: { 
                start: startInput,
                end: endInput
            }
        };

        const start = new Date(Date.now() - (HOUR_IN_MILLIS * 8));
        const end = new Date(Date.now() - (HOUR_IN_MILLIS * 7));

        // Act
        const result = getNotesBetweenDatesQuery(query, start, end);

        // Assert
        expect(result).toBe(false);
    });
    
    test.each([
        // Event fits exactly between start and end
        [new Date(Date.now() - (HOUR_IN_MILLIS * 7)), new Date(Date.now() + (HOUR_IN_MILLIS * 7))],
        // Event starts before query start
        [new Date(Date.now() - (HOUR_IN_MILLIS * 9)), new Date(Date.now() + (HOUR_IN_MILLIS * 7))],
        // Event ends before query end
        [new Date(Date.now() - (HOUR_IN_MILLIS * 7)), new Date(Date.now() + (HOUR_IN_MILLIS * 9))],
        // Query overlaps entirely with event
        [new Date(Date.now() - (HOUR_IN_MILLIS * 9)), new Date(Date.now() + (HOUR_IN_MILLIS * 9))],
    ])
    ('returns true when event overlaps with query start and end dates', (startInput: Date, endInput: Date) => {
        // Arrange
        const query: QueryFilesInput = { 
            file: new TFile(), 
            frontmatter: { 
                start: startInput,
                end: endInput,
            }
        };

        const start = new Date(Date.now() - (HOUR_IN_MILLIS * 8));
        const end = new Date(Date.now() + (HOUR_IN_MILLIS * 8));

        // Act
        const result = getNotesBetweenDatesQuery(query, start, end);

        // Assert
        expect(result).toBe(true);
    });
});