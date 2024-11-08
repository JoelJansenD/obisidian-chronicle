export class App {
    vault = new Vault();
    workspace = {
        
    };
}

export class TFile {
    
}

export class Vault {
    getMarkdownFiles = jest.fn();
    readFile = jest.fn();
    getFiles = jest.fn();
    writeFile = jest.fn();
}

export class Workspace {
    on = jest.fn();
    off = jest.fn();
}