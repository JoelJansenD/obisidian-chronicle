import { ChronicleCalendar, ChronicleCalendarType, ChronicleFullCalendar } from "@src/calendars/chronicle_calendar";
import { ChronicleSettings } from "@src/settings/chronicle_settings";

export default function addCalendar(settings: ChronicleSettings, newCalendar: CreateCalendarDto) {
    const calendar = createCalendar(newCalendar);
    settings.calendars.push(calendar);
    return calendar;
}

function createCalendar(newCalendar: CreateCalendarDto) : ChronicleCalendar {
    if(newCalendar.type === '') {
        throw "";
    }

    const baseCalendar: ChronicleCalendar = {
        id: newCalendar.id,
        colour: newCalendar.colour,
        name: newCalendar.name.trim(),
        type: newCalendar.type
    };

    switch(baseCalendar.type) {
        case "full":
            return createFullCalendar(baseCalendar, newCalendar);
        case "daily":
            return createDailyCalendar(baseCalendar, newCalendar);
        default:
            throw `Calendar type '${newCalendar.type}' is not supported`;
    }
}

function createFullCalendar(baseCalendar: ChronicleCalendar, newCalendar: CreateCalendarDto) {
    if((newCalendar.directory?.trim() ?? '') === '') {
        throw `Directory must have a value for full calendars`;
    }

    const calendar: ChronicleFullCalendar = {
        ...baseCalendar,
        directory: newCalendar.directory!,
        type: 'full'
    };
    return calendar;
}

function createDailyCalendar(baseCalendar: ChronicleCalendar, newCalendar: CreateCalendarDto) {
    if((newCalendar.header?.trim() ?? '') === '') {
        throw `Header must have a value for daily calendars`;
    }

    const calendar: ChronicleFullCalendar = {
        ...baseCalendar,
        directory: newCalendar.directory!,
        type: 'full'
    };
    return calendar;

}

export type CreateCalendarDto = {
    id: string;
    name: string;
    colour: string;
    type: ChronicleCalendarType | '';
    directory?: string;
    header?: string;
}