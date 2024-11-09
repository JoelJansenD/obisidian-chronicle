import ChroniclePlugin from "@src/main";
import { App, Modal, Notice, PluginSettingTab, Setting } from "obsidian";
import { ChronicleCalendar } from "./obsidian_chronicle_settings";
import AddNewCalendarModal from "../modals/add_new_calendar/add_new_calendar_modal";

export default class ObsidianChronicleSettingsTab extends PluginSettingTab {

    private readonly _plugin: ChroniclePlugin;
    
    constructor(app: App, plugin: ChroniclePlugin) {
        super(app, plugin);
        this._plugin = plugin;
    }
    
    display(): void {
        this.renderAsync(true);
    }

    private async renderAsync(firstRender: boolean) {
        if(firstRender) {
            // Before building the settings interface, load the current data.json into the settings
            // If we don't do this, any unsaved changes remain in the settings object, requireing a reload in Obsidian
            await this._plugin.loadSettings();
        }

        const containerEl = this.containerEl;

        containerEl.empty();

        // Calendars
        containerEl.createEl('h2', { text: 'Calendars' });
        new Setting(containerEl)
            .setName('Calendars')
            .setDesc('Add calendar')
            // Re-enable the dropdown when multiple calendar implementations are available
            // .addDropdown(cb => cb
            //     .addOption('1', 'Option 1')
            //     .addOption('2', 'Option 2'))
            .addButton(cb => cb
                .setIcon('plus')
                .onClick(_ => new AddNewCalendarModal(this.app, this._plugin, r => this.onAddCalendar(r)).open()));
        this._plugin.settings.calendars.forEach(c => this.addCalendarConfigurationRow(c, containerEl)); 

        new Setting(containerEl)
            .addButton(cb => cb
                .setButtonText('Save changes')
                .setCta()
                .onClick(async () => {
                    await this.onSaveAsync();
                    new Notice('Settings saved successfully!');
                })
            )
    }

    private addCalendarConfigurationRow(calendar: ChronicleCalendar, containerEl: HTMLElement) {
        // We create a new div inside the container so that no top row is rendered
        // between the first calendar row and the "add new calendar" row
        const setting = new Setting(containerEl.createDiv());

        // Delete calendar button
        setting.addButton(comp => comp
            .setIcon('trash')
            .setWarning()
            .onClick(() => this.onDeleteCalendar(calendar))
        );

        // Calendar name
        setting.addText(comp => comp
            .setPlaceholder('Calendar name')
            .setValue(calendar.name)
            .onChange(val => calendar.name = val)
        );

        // Calendar note directory
        setting.addText(comp => comp
            .setPlaceholder('Note directory')
            .setValue(calendar.directory)
            .setDisabled(true)
        );

        // Calendar event colour
        setting.addColorPicker(comp => comp
            .setValue(calendar.colour)
            .onChange(val => calendar.colour = val)
        );

        // Remove the info element since it doesn't have any content but takes 40% of the row width
        setting.infoEl.remove();
    }

    private onAddCalendar(result: ChronicleCalendar) {
        this._plugin.settings.calendars.push(result);
        this.renderAsync(false);
    }

    private onDeleteCalendar(calendar: ChronicleCalendar) {
        const calendarIndex = this._plugin.settings.calendars.findIndex(x => x.id === calendar.id);
        if(calendarIndex === -1) {
            const modal = new Modal(this.app).setContent(`The calendar '${ calendar.name || calendar.directory }' could not be found.`);
                new Setting(modal.contentEl).addButton(btn => btn.setButtonText('Close').setWarning().onClick(() => modal.close));
                modal.open();
            return;
        }

        const confirmationModal = new Modal(this.app);
        confirmationModal.setTitle(`Delete calendar ${ calendar.name || calendar.directory }`);
        confirmationModal.setContent('Are you sure you want to delete this calendar? Once your changes have been saved, they cannot be reverted!');
        new Setting(confirmationModal.contentEl)
            .addButton(btn => btn
                .setButtonText('Delete')
                .setWarning()
                .onClick(() => {
                    this._plugin.settings.calendars.splice(calendarIndex, 1);
                    this.renderAsync(false);
                    confirmationModal.close();
                })
            );
        confirmationModal.open();
    }

    private async onSaveAsync() {
        await this._plugin.saveData(this._plugin.settings);
    }

}