import { App, Modal, Notice, Setting } from "obsidian";

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
                .onClick(() => {
                    const validationResult = this.validate();
                    if(validationResult.length > 0) {
                        // Display all validation errors in a new dialog
                        const modal = new Modal(app).setContent(validationResult.join('\r\n'));
                        new Setting(modal.contentEl).addButton(btn => btn.setButtonText('Close').setWarning().onClick(() => modal.close));
                        modal.open();
                        return;
                    }

                    // The result can be submitted once it has passed validation
                    onSubmit({ name: this.name, path: this.path, colour: this.colour });
                    this.close();
                }));
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

    private validate() {
        const errors: string[] = [];
        if(!this.path) {
            errors.push('You must select a path to store notes');
        }
        return errors;
    }
}