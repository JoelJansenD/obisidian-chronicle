import { ChronicleSettings } from "@src/settings/obsidian_chronicle_settings";

export function getCalendarById(settings: ChronicleSettings, id: string) {
    const calendars = getCalendars(settings);
    return calendars.find(x => x.id === id) ?? null;
}

export function getCalendars(settings: ChronicleSettings) {
    return settings.calendars;
}