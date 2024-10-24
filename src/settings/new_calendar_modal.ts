import { App, Modal, Notice, Setting } from "obsidian";
import { ObsidianChronicleCalendarSetting } from "./obsidian_chronicle_settings";
import { Guid } from "guid-typescript";
import ChroniclePlugin from "@src/main";

export default class NewCalendarModal extends Modal {

    private readonly _app: App;
    private readonly _plugin: ChroniclePlugin;

    private name: string;
    private directory: string;
    private colour: string = '#d2122e';

    constructor(app: App, plugin: ChroniclePlugin, onSubmit: (result: ObsidianChronicleCalendarSetting) => void) {
        super(app);
        this._app = app;
        this._plugin = plugin;
        
        this.setTitle('New Calendar');
        this.buildNameField();
        this.buildDirectorySelectorField();
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
                    onSubmit({ id: Guid.create(), name: this.name, directory: this.directory, colour: this.colour });
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

    private buildDirectorySelectorField() {
        const claimedFolders = this._plugin.settings.calendars.map(x => x.directory);

        const folders = this._app.vault.getAllFolders();
        const options = {} as Record<string, string>;
        folders.forEach(f => {
            // If the folder has already been claimed by another calendar, don't add it to the list of options
            if(claimedFolders.contains(f.path)) {
                return;
            }

            options[f.path] = f.path
        })

        new Setting(this.contentEl)
            .setName('Directory')
            .setDesc('Directory where event notes will be stored')
            .addDropdown(dropdown => {
                dropdown
                    .addOption('', 'Select a directory') // This option will be hidden later, so it serves as a placeholder
                    .addOptions(options)
                    .onChange(val => this.directory = val);

                // Hide the placeholder option, telling users that they need to select a value
                const selectEl = dropdown.selectEl;
                selectEl.querySelector('option[value=""]')?.setAttrs({ 'disabled': true, 'hidden': true });
            });
    }

    private validate() {
        const errors: string[] = [];
        if(!this.directory) {
            errors.push('You must select a directory to store notes');
        }
        return errors;
    }
}