import { App, Modal, Setting } from "obsidian";
import { CalendarType, ChronicleCalendar } from "../../settings/chronicle_settings";
import { Guid } from "guid-typescript";
import ChroniclePlugin from "@src/main";
import addCalendar from "./add_calendar";
import getFoldersExcludingPaths from "@src/notes/get_folders_excluding_paths";

export default class AddNewCalendarModal extends Modal {

    private readonly _app: App;
    private readonly _plugin: ChroniclePlugin;

    private name: string;
    private directory: string;
    private colour: string = '#d2122e';
    private type: CalendarType;

    constructor(app: App, plugin: ChroniclePlugin, onSubmit: (result: ChronicleCalendar) => void) {
        super(app);
        this._app = app;
        this._plugin = plugin;
        
        this.setTitle('New Calendar');
        this.buildNameField();
        this.buildCalendarTypeSelectorField();
        this.buildDirectorySelectorField();
        this.buildColourPicker();

        new Setting(this.contentEl)
            .addButton(btn => btn
                .setButtonText('Add new calendar')
                .setCta()
                .onClick(() => {
                    const newCalendar: ChronicleCalendar = { 
                        id: Guid.raw(), 
                        name: this.name, 
                        directory: this.directory, 
                        colour: this.colour,
                        type: 'full'
                    };
                    const validationResult = addCalendar(this._plugin.settings, newCalendar);
                    if(validationResult && validationResult.length > 0) {
                        // Display all validation errors in a new dialog
                        const modal = new Modal(app).setContent(validationResult.join('\r\n'));
                        new Setting(modal.contentEl).addButton(btn => btn.setButtonText('Close').setWarning().onClick(() => modal.close));
                        modal.open();
                        return;
                    }

                    // The result can be submitted once it has passed validation
                    onSubmit(newCalendar);
                    this.close();
                }));
    }

    private buildCalendarTypeSelectorField() {
        new Setting(this.contentEl)
            .setName('Type')
            .addDropdown(dropdown => {
                const options: { [key in CalendarType]: string } = {
                    'full': 'Full Calendar',
                    'daily': 'Daily Calendar',
                };

                dropdown
                    .addOption('', 'Select a type') // This option will be hidden later, so it serves as a placeholder
                    .addOptions(options)
                    .onChange((val: CalendarType) => this.type = val);

                // Hide the placeholder option, telling users that they need to select a value
                const selectEl = dropdown.selectEl;
                selectEl.querySelector('option[value=""]')?.setAttrs({ 'disabled': true, 'hidden': true });
            });
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
        const unclaimedFolders = getFoldersExcludingPaths(this.app.vault, claimedFolders);
        const options = Object.fromEntries(unclaimedFolders.map(x => [x.path, x.path]));

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
}