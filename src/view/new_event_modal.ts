import ChroniclePlugin from "@src/main";
import { ObsidianChronicleCalendarSetting } from "@src/settings/obsidian_chronicle_settings";
import { App, IconName, Modal, setIcon, Setting } from "obsidian";

export type NewTaskModalResult = {
    title: string;
    calendar: ObsidianChronicleCalendarSetting;
}

export type NewTaskModalInput = {
    start: Date,
    end: Date,
    onSaveAsync?: (result: NewTaskModalResult) => Promise<boolean>;
};

export default class NewEventModal extends Modal {
    private readonly _input: NewTaskModalInput;
    private readonly _plugin: ChroniclePlugin;

    private name: string;
    private calendar: ObsidianChronicleCalendarSetting;

    constructor(app: App, plugin: ChroniclePlugin, input: NewTaskModalInput) {
        super(app);
        this._input = input;
        this._plugin = plugin;
        
        const defaultCalendar = this._plugin.settings.calendars.first();
        if(!defaultCalendar) {
            // TODO #13: Display error instead of event modal telling user to create new calendar first
            return;
        }
        this.calendar = defaultCalendar;

        this.setTitle('New Event');
        this.buildNameField();
        this.buildTimeRow();
        this.buildCalendarSelection();

        new Setting(this.contentEl)
            .addButton(btn => btn
                .setButtonText('Add event')
                .setCta()
                .onClick(async () => {
                    if(this._input.onSaveAsync && !(await this._input.onSaveAsync({ title: this.name, calendar: this.calendar }))) {
                        // If no onSaveAsync has been defined, we want to skip and simply close the modal
                        // Otherwise, if onSaveAsync returns false, we DON'T close the modal
                        return;
                    }
                    this.close();
                })
            );
    }

    onClose(): void {
        this.contentEl.empty();
    }

    private buildCalendarSelection() {
        const options: Record<string,string> = {};
        this._plugin.settings.calendars.forEach(calendar => {
            options[calendar.id] = calendar.name || calendar.directory
        });

        new Setting(this.contentEl)
            .setName('Calendar')
            .addDropdown(dropdown => dropdown
                .addOptions(options)
                .setValue(this.calendar.id)
                .onChange(val => {
                    const calendar = this._plugin.settings.calendars.find(x => x.id === val);
                    if(!calendar) {
                        // TODO #13: If no calendar was found, display error
                        return;
                    }
                    this.calendar = calendar;
                })
            );
    }

    private buildNameField() {
        new Setting(this.contentEl)
            .setName('Name')
            .addText(text => text
                .onChange(val => this.name = val));
    }

    private buildTimeRow() {
        const setting = new Setting(this.contentEl);

        // Fill control element with time information
        setting.controlEl.empty();
        setting.controlEl.createSpan({ text: this.formatStartEndString(this._input.start, this._input.end) });

        // Replace the setting name with an icon
        setting.nameEl.empty();
        const iconEl = setting.nameEl.createEl('div', { attr: { style: 'display: flex; align-items: center;' } });
        setIcon(iconEl, 'clock');
    }

    private formatStartEndString(start: Date, end: Date) {
        const capitalize = (val: string) => `${val.toUpperCase()[0]}${val.toLowerCase().substring(1)}`;

        const startWeekday = capitalize(start.toLocaleDateString('nl-NL', { weekday: 'long' }));
        const startDate = start.toLocaleDateString('nl-NL', { month: 'long', day: 'numeric' });
        const startTime = start.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

        const endWeekday = capitalize(end.toLocaleDateString('nl-NL', { weekday: 'long' }));
        const endDate = end.toLocaleDateString('nl-NL', { month: 'long', day: 'numeric' });
        const endTime = end.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

        const getDateTimeString = (weekday: string, date: string, time: string) => `${weekday}, ${date} ${time}`;
        if(startDate === endDate) {
            return `${getDateTimeString(startWeekday, startDate, startTime)} – ${endTime}`;
        }
        return `${getDateTimeString(startWeekday, startDate, startTime)} – ${getDateTimeString(endWeekday, endDate, endTime)}`;
    }
}