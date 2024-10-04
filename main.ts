import { Plugin } from 'obsidian';

export default class ChroniclePlugin extends Plugin {

    statusBarTextElement: HTMLSpanElement;

    onload() {
        this.statusBarTextElement = this.addStatusBarItem().createEl('span');

        this.app.workspace.on('active-leaf-change', async () => {
            const file = this.app.workspace.getActiveFile();
            if(file) {
                const content = await this.app.vault.read(file);
                this.statusBarTextElement.textContent = `You've got ${this.getLineCount(content)} lines`;
            }
        })

        this.app.workspace.on('editor-change', editor => {
            const document = editor.getDoc().getValue();
            this.statusBarTextElement.textContent = `You've got ${this.getLineCount(document)} lines`;
        });
    }

    private getLineCount(fileContent?: string) {
        return fileContent
            ? fileContent.split(/\r\n|\r|\n/).length
            : 0;
    }

};