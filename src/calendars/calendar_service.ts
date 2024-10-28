import { ChronicleCalendar, ChronicleSettings } from "@src/settings/obsidian_chronicle_settings";

export interface ICalendarService {
    getCalendarById(id: string): ChronicleCalendar | null;
    getCalendars(): ChronicleCalendar[];
}

export default class CalendarService implements ICalendarService {
    private readonly _settings: ChronicleSettings;
    
    constructor(settings: ChronicleSettings) {
        this._settings = settings;
    }

    getCalendarById(id: string) {
        const calendars = this.getCalendars();
        return calendars.find(x => x.id === id) ?? null;
    }

    getCalendars() {
        return this._settings.calendars;
    }
}