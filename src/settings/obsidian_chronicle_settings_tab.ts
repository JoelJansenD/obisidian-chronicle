import ChroniclePlugin from "@src/main";
import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import { ObsidianChronicleCalendarSetting } from "./obsidian_chronicle_settings";
import NewCalendarModal from "./new_calendar_modal";

export default class ObsidianChronicleSettingsTab extends PluginSettingTab {

    private readonly _plugin: ChroniclePlugin;
    
    constructor(app: App, plugin: ChroniclePlugin) {
        super(app, plugin);
        this._plugin = plugin;
    }
    
    display(): void {
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
                .onClick(_ => new NewCalendarModal(this.app, this._plugin, r => this.onAddCalendar(r)).open()));
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

    private addCalendarConfigurationRow(calendar: ObsidianChronicleCalendarSetting, containerEl: HTMLElement) {
        // We create a new div inside the container so that no top row is rendered
        // between the first calendar row and the "add new calendar" row
        const setting = new Setting(containerEl.createDiv());

        // Delete calendar button
        setting.addButton(comp => comp
            .setIcon('cross')
            .setWarning()
            .onClick(() => this.onDeleteCalendar(calendar))
        );

        // Calendar name
        setting.addText(comp => comp
            .setPlaceholder('Calendar name')
            .setValue(calendar.name)
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
        );

        // Remove the info element since it doesn't have any content but takes 40% of the row width
        setting.infoEl.remove();
    }

    private onAddCalendar(result: ObsidianChronicleCalendarSetting) {
        this._plugin.settings.calendars.push(result);
        this.display();
    }

    private onDeleteCalendar(calendar: ObsidianChronicleCalendarSetting) {
        // TODO #13: confirmation dialog
        const calendarIndex = this._plugin.settings.calendars.findIndex(x => x.id.toString() === calendar.id.toString());
        if(calendarIndex === -1) {
            // TODO #13: display error
            return;
        }

        this._plugin.settings.calendars.splice(calendarIndex, 1);
        this.display();
    }

    private async onSaveAsync() {
        await this._plugin.saveData(this._plugin.settings);
    }

}