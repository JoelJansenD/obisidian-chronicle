import ChroniclePlugin from "@src/main";
import { App, Modal, Notice, PluginSettingTab, Setting } from "obsidian";
import AddNewCalendarModal from "../modals/add_new_calendar/add_new_calendar_modal";
import deleteCalendarWithId from "./delete_calendar_with_id";
import { ChronicleCalendar, ChronicleDailyCalendar, ChronicleFullCalendar } from "@src/calendars/chronicle_calendar";

export default class ChronicleSettingsTab extends PluginSettingTab {

    private readonly _plugin: ChroniclePlugin;

    constructor(app: App, plugin: ChroniclePlugin) {
        super(app, plugin);
        this._plugin = plugin;
    }
    
    display(): void {
        // Before building the settings interface, load the current data.json into the settings
        // If we don't do this, any unsaved changes remain in the settings object, requireing a reload in Obsidian
        this._plugin.loadSettings()
        .then(() => {
            this.renderAsync();
        })
    }

    private async renderAsync() {
        const containerEl = this.containerEl;

        containerEl.empty();

        // Calendars
        containerEl.createEl('h2', { text: 'Calendars' });
        new Setting(containerEl)
            .setName('Calendars')
            .setDesc('Add calendar')
            .addButton(cb => cb
                .setIcon('plus')
                .onClick(_ => new AddNewCalendarModal(this.app, this._plugin, r => this.onAddCalendar(r)).open()));
        this._plugin.settings.calendars.forEach(c => this.addCalendarConfigurationRow(c, containerEl)); 

        new Setting(containerEl)
            .addButton(cb => cb
                .setButtonText('Save changes')
                .setCta()
                .onClick(async () => {
                    await this._plugin.saveData(this._plugin.settings);
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
        setting.addText(comp => {
            comp.setDisabled(true);
            switch(calendar.type) {
                case 'full':
                    comp.setValue((calendar as ChronicleFullCalendar).directory);
                    break;
                case 'daily':
                    comp.setValue((calendar as ChronicleDailyCalendar).header);
                    break;
            }
        });

        // Calendar event colour
        setting.addColorPicker(comp => comp
            .setValue(calendar.colour)
            .onChange(val => calendar.colour = val)
        );

        // Remove the info element since it doesn't have any content but takes 40% of the row width
        setting.infoEl.remove();
    }

    private onAddCalendar(_: ChronicleCalendar) {
        this.renderAsync();
    }

    private onDeleteCalendar(calendar: ChronicleCalendar) {
        const confirmationModal = new Modal(this.app);
        confirmationModal.setTitle(`Delete calendar ${ this.getCalendarLabel(calendar) }`);
        confirmationModal.setContent('Are you sure you want to delete this calendar? Once your changes have been saved, they cannot be reverted!');
        new Setting(confirmationModal.contentEl)
            .addButton(btn => btn
                .setButtonText('Delete')
                .setWarning()
                .onClick(() => {
                    try {
                        deleteCalendarWithId(this._plugin.settings, calendar.id);
                        this.renderAsync();
                        confirmationModal.close();
                    }
                    catch(e) {
                        const modal = new Modal(this.app).setContent(e);
                        new Setting(modal.contentEl).addButton(btn => btn.setButtonText('Close').setWarning().onClick(() => modal.close));
                        modal.open();
                        return;
                    }
                })
            );
        confirmationModal.open();
    }

    private getCalendarLabel(calendar: ChronicleCalendar) {
        switch(calendar.type) {
            case 'full':
                const fullCalendar = calendar as ChronicleFullCalendar;
                return fullCalendar.name || fullCalendar.directory;
            case 'daily':
                const dailyCalendar = calendar as ChronicleDailyCalendar;
                return dailyCalendar.name || dailyCalendar.header;
            default:
                throw `Calendar type '${calendar.type}' is not supported`;
        }
    }

}