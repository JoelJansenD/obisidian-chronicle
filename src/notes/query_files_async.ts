import { App, FrontMatterCache, TFile } from "obsidian";
import getFiles from "./get_files";

export type QueryFilesInput = {
    file: TFile,
    frontmatter: FrontMatterCache | null
};

export default async function queryFilesAsync(app: App, query: (item: QueryFilesInput) => boolean) {
    const files = getFiles(app);
    const fileDataPromises = files.map(file => gatherFileDataAsync(app, file));
    const filesData = await Promise.all(fileDataPromises);
    return filesData.filter(query);
}

async function gatherFileDataAsync(app: App, file: TFile) : Promise<QueryFilesInput> {
    const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter ?? null;
    return {
        file,
        frontmatter
    }
}