import { replaceLastOccurance } from "./string_utils";

describe('replaceLastOccurance', () => {
    it('replaces only the last occurance of a single character', () => {
        // Arrange
        const input = 'this is a test';
        const expected = 'this is a tesco';

        // Act
        const result = replaceLastOccurance(input, 't', 'co');

        // Assert
        expect(result).toBe(expected);
    });

    it('replaces only the last occurance of multiple characters', () => {
        // Arrange
        const input = 'this test is a test';
        const expected = 'this test is a success';

        // Act
        const result = replaceLastOccurance(input, 'test', 'success');

        // Assert
        expect(result).toBe(expected);
    });

    it('replaces only the last occurance of multiple characters with spaces in between', () => {
        // Arrange
        const input = 'this test is a great test';
        const expected = 'this test is a massive success';

        // Act
        const result = replaceLastOccurance(input, 'great test', 'massive success');

        // Assert
        expect(result).toBe(expected);
    });
    
    it('return the original string if the pattern is not found', () => {
        // Arrange
        const input = 'this is a test';
        const expected = 'this is a test';

        // Act
        const result = replaceLastOccurance(input, 'not a test', 'something to replace');

        // Assert
        expect(result).toBe(expected);
    });
});