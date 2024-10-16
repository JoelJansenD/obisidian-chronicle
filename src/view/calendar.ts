import {
    Calendar,
    EventApi,
    EventSourceInput,
    ToolbarInput,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarConfig from "./calendar_config";

const MOBILE_WIDTH_CUTOFF_IN_PX = 864;

// There is an issue with FullCalendar RRule support around DST boundaries which is fixed by this monkeypatch:
// https://github.com/fullcalendar/fullcalendar/issues/5273#issuecomment-1360459342
rrulePlugin.recurringTypes[0].expand = function (errd, fr, de) {
    const hours = errd.rruleSet._dtstart.getHours();
    return errd.rruleSet
        .between(de.toDate(fr.start), de.toDate(fr.end), true)
        .map((d: Date) => {
            return new Date(
                Date.UTC(
                    d.getFullYear(),
                    d.getMonth(),
                    d.getDate(),
                    hours,
                    d.getMinutes()
                )
            );
        });
};

type ModifyEventParameters = {
    event: EventApi; 
    oldEvent: EventApi; 
    revert: () => void;
}

export function renderCalendar(containerEl: HTMLElement, eventSources: EventSourceInput[], config?: CalendarConfig) : Calendar {
    const settings = config ?? {};
    const isMobile = window.innerWidth < MOBILE_WIDTH_CUTOFF_IN_PX;
    
    const modifyEvent =
        settings.modifyEvent &&
        (async ({ event, oldEvent, revert }: ModifyEventParameters) => ((await settings.modifyEvent!(event, oldEvent)) || revert()));

    const cal = new Calendar(containerEl, {
        plugins: [
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
            rrulePlugin,
        ],

        initialView: 'timeGridWeek',
        nowIndicator: true,
        scrollTimeReset: false,
        dayMaxEvents: true,

        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
        },

        views: {
            dayGridMonth: {
                type: 'dayGrid',
                buttonText: 'Month'
            },
            timeGridDay: {
                type: "timeGrid",
                duration: { days: 1 },
                buttonText: "Day",
            },
            timeGridWeek: {
                type: "timeGrid",
                duration: { days: 7 },
                buttonText: "Week",
            },
        },
        firstDay: settings.firstDay,
        eventTimeFormat: {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
        },
        slotLabelFormat: {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
        },
        eventSources,
        eventClick: settings.eventClick,

        selectable: settings.select && true,
        selectMirror: settings.select && true,
        select: settings.select &&
            (async (info) => {
                await settings.select!(info.start, info.end, info.allDay, info.view.type);
                info.view.calendar.unselect();
            }),

        editable: modifyEvent && true,
        eventDrop: modifyEvent,
        eventResize: modifyEvent,

        eventMouseEnter: settings.eventMouseEnter,

        eventDidMount: ({ event, el, textColor }) => {
            console.log('eventDidMount')
        },

        longPressDelay: 250,
    });

    cal.render();
    return cal;
}