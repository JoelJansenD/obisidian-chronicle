import { App, Modal } from "obsidian";

export default class NewTaskModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.createEl('h1', { text: 'Add new Event' });

        const eventNameRow = this.createFormRow();
        eventNameRow.createSpan({ text: 'Name' });
        eventNameRow.createEl('input', { type: 'text' });

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
}