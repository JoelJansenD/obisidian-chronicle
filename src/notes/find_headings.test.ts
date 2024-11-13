import { Root } from "remark-parse/lib";
import { RootContent, RootContentMap } from "mdast";
import findHeadings from "./find_headings";

describe('findHeadings', () => {
    it('returns all headings that are found', () => {
        // Arrange
        const root: Root = {
            children: [
                createElement('heading', '', 1, [createElement('text', 'first header', 2)]),
                createElement('heading', '', 1, [createElement('text', 'second header', 2)]),
                createElement('heading', '', 2, [createElement('text', 'first subheader', 3)]),
            ],
            type: 'root'
        }

        // Act
        const result = findHeadings(root);

        // Assert
        expect(result).toHaveLength(3);
        expect(result[0].text).toBe('first header');
        expect(result[0].depth).toBe(1);
        expect(result[1].text).toBe('second header');
        expect(result[1].depth).toBe(1);
        expect(result[2].text).toBe('first subheader');
        expect(result[2].depth).toBe(2);
    });
    
    it('ignores elements that are not headins', () => {
        // Arrange
        const root: Root = {
            children: [
                createElement('text', 'this is some text that will be ignored', 1, []),
                createElement('heading', '', 1, [createElement('text', 'second header', 2)]),
                createElement('heading', '', 2, [createElement('text', 'first subheader', 3)]),
            ],
            type: 'root'
        }

        // Act
        const result = findHeadings(root);

        // Assert
        expect(result).toHaveLength(2);
        expect(result[0].text).toBe('second header');
        expect(result[0].depth).toBe(1);
        expect(result[1].text).toBe('first subheader');
        expect(result[1].depth).toBe(2);
    });
    
    it('does not return headings that have no text', () => {
        // Arrange
        const root: Root = {
            children: [
                createElement('heading', '', 1, []),
                createElement('heading', '', 1, [createElement('text', 'second header', 2)]),
                createElement('heading', '', 2, [createElement('text', 'first subheader', 3)]),
            ],
            type: 'root'
        }

        // Act
        const result = findHeadings(root);

        // Assert
        expect(result).toHaveLength(2);
        expect(result[0].text).toBe('second header');
        expect(result[0].depth).toBe(1);
        expect(result[1].text).toBe('first subheader');
        expect(result[1].depth).toBe(2);
    });
});

function createElement(type: any = 'heading', value = '', depth: 1|2|3|4|5|6 = 1, children: any[] = []) : RootContent {
    return {
        children,
        depth,
        identifier: 'test id',
        referenceType: 'full',
        type,
        url: '',
        value
    }
}