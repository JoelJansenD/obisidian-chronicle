import { DateSelectArg } from "@fullcalendar/core";
import { App, Modal, setIcon } from "obsidian";

export type NewTaskModalInput = {
    start: Date,
    end: Date
};

export default class NewTaskModal extends Modal {
    private _input: NewTaskModalInput;

    constructor(app: App, input: NewTaskModalInput) {
        super(app);
        this._input = input;
    }
    a: DateSelectArg;

    onOpen(): void {
        const { contentEl } = this;
        contentEl.createEl('h1', { text: 'Add new Event' });

        const eventNameRow = this.createFormRow();
        eventNameRow.createSpan({ text: 'Name' });
        eventNameRow.createEl('input', { type: 'text' });

        const dateTimeRow = this.createFormRow();
        const clockIcon = dateTimeRow.createDiv();
        setIcon(clockIcon, 'hourglass');
        dateTimeRow.createEl('span', { text: this.formatStartEndString(this._input.start, this._input.end) });

        const actionContainer = this.createFormRow();
        const cancelButton = actionContainer.createEl('button', { text: 'Cancel' });
        cancelButton.addEventListener('click', () => this.close());
        const saveButton = actionContainer.createEl('button', { text: 'Save' });
        saveButton.addEventListener('click', () => this.close());
    }

    onClose(): void {
        this.contentEl.empty();
    }

    private createFormRow() {
        return this.contentEl.createDiv({ cls: 'oc__modal__row' });
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