import { QueryFilesInput } from "@src/notes/query_files_async";

export default function getNotesBetweenDatesQuery(item: QueryFilesInput, start: Date, end: Date) {
    const dateOrNull = (dt?: string) => dt ? new Date(dt) : null;
    const startTime = dateOrNull(item.frontmatter?.['start']);
    const endTime = dateOrNull(item.frontmatter?.['end']);

    if(!startTime || !endTime) {
        return false;
    }

    if(startTime > end) {
        return false;
    }

    if(endTime < start) {
        return false;
    }

    return true;
}