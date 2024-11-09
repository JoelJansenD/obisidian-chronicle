export class App {
    vault = new Vault();
    metadataCache = new MetadataCache();
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
    loadData = jest.fn();
}

export class PluginSettingTab {

}

export class Vault {
    getAllFolders = jest.fn();
    getMarkdownFiles = jest.fn();
    getFiles = jest.fn();
    read = jest.fn();
    writeFile = jest.fn();
}