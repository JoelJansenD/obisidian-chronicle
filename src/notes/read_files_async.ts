import { App, TFile } from "obsidian";

export default async function readFilesAsync(app: App, files: TFile[]) {
    const fileWithContentPromises = files.map(file => readFileAsync(app, file));
    return await Promise.all(fileWithContentPromises);
}

async function readFileAsync(app: App, file: TFile) {
    return { file: file, content: await app.vault.read(file) };
}