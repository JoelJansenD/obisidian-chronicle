import { DateSelectArg } from "@fullcalendar/core";
import { App, IconName, Modal, setIcon } from "obsidian";

export type NewTaskModalResult = {
    title: string;
}

export type NewTaskModalInput = {
    start: Date,
    end: Date,
    onSaveAsync?: (result: NewTaskModalResult) => Promise<boolean>;
    onCancelAsync?: () => Promise<boolean>;
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
        const container = contentEl.createDiv({ cls: 'oc__modal__container' });
        const eventTitleRow = this.createFormRow(container, null, 'input', { type: 'text', placeholder: 'Add new event', cls: 'oc__modal__item--header' });
        this.createFormRow(container, 'hourglass', 'span', { text: this.formatStartEndString(this._input.start, this._input.end) });

        const actionRow = this.createFormRow(container, null, 'div', { cls: 'oc__modal__item--actions' });
        const actionContent = actionRow.contentEl;
        const cancelButton = actionContent.createEl('button', { text: 'Cancel', cls: 'oc__button oc__button--secondary' });
        const saveButton = actionContent.createEl('button', { text: 'Save', cls: 'oc__button oc__button--primary' });

        cancelButton.addEventListener('click', async () => {
            if(!this._input.onCancelAsync || await this._input.onCancelAsync()) {
                this.close();
            }
        });
        saveButton.addEventListener('click', async () => {
            if(!this._input.onSaveAsync || await this._input.onSaveAsync({ title: (eventTitleRow.contentEl as HTMLInputElement).value })) {
                this.close();
            }
        });
    }

    onClose(): void {
        this.contentEl.empty();
    }

    private createFormRow<K extends keyof HTMLElementTagNameMap>(container: HTMLDivElement, icon: IconName | null, tag: K, o?: DomElementInfo) {
        let iconEl: HTMLDivElement | null = null;

        if(icon) {
            iconEl = container.createDiv({ cls: 'oc__modal__item oc__modal__item--icon' });
            setIcon(iconEl, icon);
        }
        const contentEl = container.createEl(tag, o ? {...o, cls: `oc__modal__item oc__modal__item--content ${o.cls}` } : { cls: 'oc__modal__item oc__modal__item--content' });
        return {iconEl, contentEl};
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