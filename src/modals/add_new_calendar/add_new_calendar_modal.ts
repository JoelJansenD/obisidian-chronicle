import { App, Modal, Setting } from "obsidian";
import { Guid } from "guid-typescript";
import ChroniclePlugin from "@src/main";
import addCalendar, { CreateCalendarDto } from "./add_calendar";
import getFoldersExcludingPaths from "@src/notes/get_folders_excluding_paths";
import { ChronicleCalendar, ChronicleCalendarType, ChronicleFullCalendar } from "@src/calendars/chronicle_calendar";
import getDailyNotesTemplateAsync from "@src/notes/daily/get_daily_notes_template_async";
import findHeadings from "@src/notes/find_headings";
import { remark } from "remark";


export default class AddNewCalendarModal extends Modal {

    private readonly _app: App;
    private readonly _plugin: ChroniclePlugin;
    private readonly _onSubmit: (result: ChronicleCalendar) => void;

    private name: string;
    private directory: string;
    private header: string;
    private colour: string = '#d2122e';
    private type: ChronicleCalendarType;

    constructor(app: App, plugin: ChroniclePlugin, onSubmit: (result: ChronicleCalendar) => void) {
        super(app);
        this._app = app;
        this._plugin = plugin;
        this._onSubmit = onSubmit;
        
        this.renderAsync();
    }

    private async renderAsync() {
        this.contentEl.empty();

        this.setTitle('New Calendar');
        this.buildNameField();
        this.buildCalendarTypeSelectorField();
        await this.buildTypeSpecificFieldsAsync();
        this.buildColourPicker();
        this.buildSubmissionRow();
    }

    private buildCalendarTypeSelectorField() {
        new Setting(this.contentEl)
            .setName('Type')
            .addDropdown(dropdown => {
                const options: { [key in ChronicleCalendarType]: string } = {
                    'full': 'Full Calendar',
                    'daily': 'Daily Calendar',
                };

                dropdown
                    .addOption('', 'Select a type') // This option will be hidden later, so it serves as a placeholder
                    .addOptions(options)
                    .setValue(this.type || '')
                    .onChange((val: ChronicleCalendarType) => {
                        this.type = val;
                        this.renderAsync();
                    });

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

    private buildDirectorySelectorField() {
        const claimedFolders = this._plugin.settings.calendars.filter(x => x.type === 'full').map((x: ChronicleFullCalendar) => x.directory);
        const unclaimedFolders = getFoldersExcludingPaths(this.app.vault, claimedFolders);
        const options = Object.fromEntries(unclaimedFolders.map(x => [x.path, x.path]));

        new Setting(this.contentEl)
            .setName('Directory')
            .setDesc('Directory where event notes will be stored')
            .addDropdown(dropdown => {
                dropdown
                    .addOption('', 'Select a directory') // This option will be hidden later, so it serves as a placeholder
                    .addOptions(options)
                    .setValue(this.directory || '')
                    .onChange(val => this.directory = val);

                // Hide the placeholder option, telling users that they need to select a value
                const selectEl = dropdown.selectEl;
                selectEl.querySelector('option[value=""]')?.setAttrs({ 'disabled': true, 'hidden': true });
            });
    }

    private async buildHeaderSelectorFieldAsync() {
        const dailyNoteTemplate = await getDailyNotesTemplateAsync(this.app);
        if(!dailyNoteTemplate) {
            // TODO #9: Display warning
            return;
        }
        
        const dailyNoteHeaders = findHeadings(remark.parse(dailyNoteTemplate));
        
        const dailyNoteHeaderOptions = Object.fromEntries(dailyNoteHeaders.map(h => {
            const header = `${'#'.repeat(h.depth)} ${h.text}`;
            return [header, header];
        }));
        new Setting(this.contentEl)
            .setName('Section')
            .setDesc('Heading under which the events will be added')
            .addDropdown(dropdown => {
                dropdown
                    .addOption('', 'Select a heading') // This option will be hidden later, so it serves as a placeholder
                    .addOptions(dailyNoteHeaderOptions)
                    .setValue(this.header)
                    .onChange(val => this.header = val);

                const selectEl = dropdown.selectEl;
                selectEl.querySelector('option[value=""]')?.setAttrs({ 'disabled': true, 'hidden': true });
            });
    }

    private buildNameField() {
        new Setting(this.contentEl)
            .setName('Name')
            .addText(text => text
                .setValue(this.name)
                .onChange(val => this.name = val));
    }

    private buildSubmissionRow() {
        new Setting(this.contentEl)
            .addButton(btn => btn
                .setButtonText('Add new calendar')
                .setCta()
                .onClick(() => this.onSubmissionClick()));
    }
    
    private async buildTypeSpecificFieldsAsync() {
        switch(this.type) {
            case "full":
                this.buildDirectorySelectorField();
                break;
            case "daily":
                await this.buildHeaderSelectorFieldAsync();
                break;
        }
    }

    private onSubmissionClick() {
        const createCalendarDto: CreateCalendarDto = { 
            id: Guid.raw(), 
            name: this.name, 
            directory: this.directory,
            header: this.header,
            colour: this.colour,
            type: this.type
        };

        let calendar: ChronicleCalendar;
        try {
            calendar = addCalendar(this._plugin.settings, createCalendarDto);
        }
        catch(e) {
            const modal = new Modal(this._app).setContent(e);
            new Setting(modal.contentEl).addButton(btn => btn.setButtonText('Close').setWarning().onClick(() => modal.close));
            modal.open();
            return;
        }

        // The result can be submitted once it has passed validation
        this._onSubmit(calendar);
        this.close();
    }
}