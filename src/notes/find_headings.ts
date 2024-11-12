import { Root } from "remark-parse/lib";

export default function findHeadings(root: Root) {
    const titles: { depth: number, text: string }[] = [];
    root.children.forEach(child => {
        if(child.type !== 'heading') {
            return;
        }

        const firstText = child.children.find(x => x.type === 'text');
        if(!firstText) {
            return;
        }

        titles.push({ depth: child.depth, text: firstText.value });
    });
    return titles;
}