import { Vault } from "obsidian";

export default function getFoldersExcludingPaths(vault: Vault, paths: string[]) {
    return vault.getAllFolders().filter(folder => !paths.includes(folder.path));
}