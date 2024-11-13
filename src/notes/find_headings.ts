import { Root } from "remark-parse/lib";
import { Text } from "mdast";

export default function findHeadings(root: Root) {
    const titles: { depth: number, text: string }[] = [];
    root.children.forEach(child => {
        if(child.type !== 'heading') {
            return;
        }

        const firstText = child.children.find(x => x.type === 'text') as Text | undefined;
        if(!firstText) {
            return;
        }

        titles.push({ depth: child.depth, text: firstText.value });
    });
    return titles;
}