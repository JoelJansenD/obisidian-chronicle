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
        
    const createDate = (date: {year: number, month: number, day: number, hour: number, minute: number, second: number}) => 
        new Date(date.year,date.month,date.day,date.hour,date.minute,date.second);
    const dateIsToday = (date: Date) => date.setHours(0,0,0,0) === new Date().setHours(0,0,0,0);

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
        events: [],

        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
        },

        titleFormat: (dateArg) => {
            const startDate = createDate(dateArg.start);
            if(dateArg.end) {
                const endDate = createDate(dateArg.end);
                return `${startDate.toLocaleDateString('nl-NL')}${dateArg.defaultSeparator}${endDate.toLocaleDateString('nl-NL')}`;
            }
            return startDate.toLocaleDateString('nl-NL');
        },

        dayHeaderContent: (dateArg) => ({ 
            html: `<div class='oc-col-header-cell ${dateIsToday(dateArg.date) ? 'oc-col-header-cell-active' :  ''}'>
                <span class='oc-col-header-cell-weekday' style='text-decoration:none;'>${dateArg.date.toLocaleDateString('nl-NL', { weekday: 'short' }).toUpperCase()}</span>
                <div class='oc-col-header-cell-day'>${dateArg.date.toLocaleDateString('nl-NL', { day: 'numeric' })}</div>
            </div>` }),

        views: {
            dayGridMonth: {
                type: 'dayGrid',
                buttonText: 'Month'
            },
            timeGridDay: {
                titleFormat: (dateArg) => createDate(dateArg.start).toLocaleDateString('nl-NL'),
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
            (async (args) => {
                await settings.select!(args);
                args.view.calendar.unselect();
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