import { App, Modal, Setting } from "obsidian";

export type NewCalendarSubmission = {
    name: string;
    path: string;
    colour: string;
}

export default class NewCalendarModal extends Modal {

    private readonly _app: App;

    private name: string;
    private path: string;
    private colour: string = '#d2122e';

    constructor(app: App, onSubmit: (result: NewCalendarSubmission) => void) {
        super(app);
        this._app = app;
        
        this.setTitle('New Calendar');
        this.buildNameField();
        this.buildPathSelectorField();
        this.buildColourPicker();

        new Setting(this.contentEl)
            .addButton(btn => btn
                .setButtonText('Add new calendar')
                .setCta()
                .onClick(() => onSubmit({ name: this.name, path: this.path, colour: this.colour })));
    }

    private buildColourPicker() {
        new Setting(this.contentEl)
            .setName('Colour')
            .addColorPicker(comp => comp
                .setValue(this.colour)
                .onChange(val => this.colour = val));
    }

    private buildNameField() {
        new Setting(this.contentEl)
            .setName('Name')
            .addText(text => text
                .onChange(val => this.name = val));
    }

    private buildPathSelectorField() {
        const folders = this._app.vault.getAllFolders();
        const options = {} as Record<string, string>;
        folders.forEach(f => {
            options[f.path] = f.path
        })

        new Setting(this.contentEl)
            .setName('Path')
            .addDropdown(comp => comp
                .addOptions(options)
                .onChange(val => this.path = val));
    }
}