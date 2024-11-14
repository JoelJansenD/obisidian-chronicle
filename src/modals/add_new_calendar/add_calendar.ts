import { ChronicleCalendar, ChronicleCalendarType, ChronicleDailyCalendar, ChronicleFullCalendar } from "@src/calendars/chronicle_calendar";
import { ChronicleSettings } from "@src/settings/chronicle_settings";

export default function addCalendar(settings: ChronicleSettings, newCalendar: CreateCalendarDto) {
    const calendar = createCalendar(newCalendar);
    settings.calendars.push(calendar);
    return calendar;
}

function createCalendar(newCalendar: CreateCalendarDto) : ChronicleCalendar {
        switch(newCalendar.type) {
        case "full":
            return createFullCalendar(newCalendar);
        case "daily":
            return createDailyCalendar(newCalendar);
        default:
            throw `Calendar type '${newCalendar.type}' is not supported`;
    }
}

function createBaseCalendar(newCalendar: CreateCalendarDto) : ChronicleCalendar {
    return {
        id: newCalendar.id,
        name: newCalendar.name,
        colour: newCalendar.colour,
        // We can assume that the type is correct, since we validate in createCalendar()
        type: newCalendar.type as ChronicleCalendarType
    }
}

function createDailyCalendar(newCalendar: CreateCalendarDto) {
    if((newCalendar.header?.trim() ?? '') === '') {
        throw `Header must have a value for daily calendars`;
    }

    const baseCalendar = createBaseCalendar(newCalendar);
    const calendar: ChronicleDailyCalendar = {
        ...baseCalendar,
        header: newCalendar.header!,
        type: 'daily'
    };
    return calendar;

}

function createFullCalendar( newCalendar: CreateCalendarDto) {
    if((newCalendar.directory?.trim() ?? '') === '') {
        throw `Directory must have a value for full calendars`;
    }

    const baseCalendar = createBaseCalendar(newCalendar);
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