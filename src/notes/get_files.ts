import { App, Vault } from "obsidian";



export default function getFiles(app: App) {
    return app.vault.getFiles();
}