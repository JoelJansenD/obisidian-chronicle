import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { IconName, ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE = 'chronicle-view';

export default class ChronicleView extends ItemView {

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return 'display text';
    }

    getIcon() {
        return 'calendar';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();

        const content = document.createElement('div');
        const calendar = new Calendar(content, {
            plugins: [ dayGridPlugin, timeGridPlugin ],
            initialView: 'timeGridWeek',  // Default view is Month view
            headerToolbar: {
                left: 'prev,next today',  // Navigation buttons
                center: 'title',          // Calendar title (month/year)
                right: 'dayGridMonth,timeGridWeek,timeGridDay'  // View options: Month, Week, Day
            },
            selectable: true,  // Allow selecting time slots
            editable: true,    // Allow events to be dragged and resized
            events: [
                // Array of event objects to display on the calendar
                {
                    title: 'Event 1',
                    start: '2024-10-04',
                    end: '2024-10-05'
                },
                {
                    title: 'Event 2',
                    start: '2024-10-10',
                    end: '2024-10-12'
                }
            ],
            // dateClick: function(info) {
            //     // Triggered when a date is clicked
            //     alert('Date clicked: ' + info.dateStr);
            // },
            eventClick: function(info) {
                // Triggered when an event is clicked
                alert('Event: ' + info.event.title);
            }
        });

        container.appendChild(content);
        calendar.render();
        calendar.updateSize();
    }

}