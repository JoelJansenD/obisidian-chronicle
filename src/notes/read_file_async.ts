import { App, TFile } from "obsidian";

export default async function readFileAsync(app: App, file: TFile) {
    return await app.vault.read(file);
}