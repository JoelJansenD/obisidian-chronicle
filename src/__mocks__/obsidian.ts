export class App {
    internalPlugins = new Plugins();
    metadataCache = new MetadataCache();
    vault = new Vault();
}

export class CachedMetadata {
    frontmatter = new FrontMatterCache();
}

export class FrontMatterCache {

}

export class ItemView {

}

export class MetadataCache {
    getFileCache = jest.fn();
}

export class Modal {

}

export class TFile {
}

export class TFolder {
}

export class Plugin {
    enabled = true;
    loadData = jest.fn();
    instance = {
        options: {} as { [key:string]: string | undefined }
    }
}

export class Plugins {
    plugins: {[key: string]: Plugin};
    getPluginById = jest.fn();
}

export class PluginSettingTab {

}

export class Vault {
    create = jest.fn();
    getAllFolders = jest.fn();
    getMarkdownFiles = jest.fn();
    getFileByPath = jest.fn();
    getFiles = jest.fn();
    read = jest.fn();
    writeFile = jest.fn();
}