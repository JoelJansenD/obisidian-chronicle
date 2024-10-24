import { App, FrontMatterCache, TFile } from "obsidian";

type FileWithMetadata = {
    file: TFile,
    metadata: FrontMatterCache
};

export default class NoteDataAccess {
    
    private readonly _app: App;
    
    constructor(app: App) {
        this._app = app;
    }

    public async getFileContentAsync(file: TFile) {
        return (await this.getFileContentInternalAsync(file)).content;
    }

    public async getFilesContentAsync(files: TFile[]) {
        const filePromises = files.map(this.getFileContentInternalAsync);
        return await Promise.all(filePromises);
    }

    public async getFilesContentInDirectoryAsync(path: string) {
        const files = this.getFilesInDirectory(path);
        const filePromises = files.map(this.getFileContentInternalAsync);
        return await Promise.all(filePromises);
    }

    public getFilesInDirectory(directoryPath: string) {
        const files = this._app.vault.getFiles();
        return files.filter(file => file.path.startsWith(directoryPath));
    }

    public getFilesInDirectoryWithMetadata(directoryPath: string, predicate: (item: FrontMatterCache) => boolean) {
        const files = this._app.vault.getFiles();
        const result = files.reduce((filesFittingPredicate: FileWithMetadata[], currentFile: TFile) => {
            if(!currentFile.path.startsWith(directoryPath)) {
                return filesFittingPredicate;
            }

            const fileWithMetadata = this.getFileFrontmatter(currentFile);
            if(fileWithMetadata && predicate(fileWithMetadata.metadata)){
                filesFittingPredicate.push(fileWithMetadata);
            };
            return filesFittingPredicate;
        }, [] as FileWithMetadata[]);
        return result;
    }

    private async getFileContentInternalAsync(file: TFile) {
        return { file: file, content: await this._app.vault.read(file) };
    }

    private getFileFrontmatter(file: TFile): FileWithMetadata | null {
        const frontmatter = this._app.metadataCache.getFileCache(file)?.frontmatter;
        if(!frontmatter) {
            return null;
        }
        return { file: file, metadata: frontmatter };
    }
}