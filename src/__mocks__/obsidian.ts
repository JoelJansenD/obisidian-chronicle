export class App {
    vault = new Vault();
    metadataCache = new MetadataCache();
}

export class CachedMetadata {
    frontmatter = new FrontMatterCache();
}

export class FrontMatterCache {

}

export class MetadataCache {
    getFileCache = jest.fn();
}

export class TFile {
    
}

export class Vault {
    getMarkdownFiles = jest.fn();
    read = jest.fn();
    getFiles = jest.fn();
    writeFile = jest.fn();
}