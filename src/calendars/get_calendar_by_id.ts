import { ChronicleSettings } from "@src/settings/chronicle_settings";

export function getCalendarById(settings: ChronicleSettings, id: string) {
    const calendars = settings.calendars;
    return calendars.find(x => x.id === id) ?? null;
}