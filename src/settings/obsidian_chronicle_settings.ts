export default interface ObsidianChronicleSettings {
    calendars: ObsidianChronicleCalendarSetting[];
}

export interface ObsidianChronicleCalendarSetting {
    id: string;
    name: string;
    directory: string;
    colour: string;
}

export const DEFAULT_SETTINGS : ObsidianChronicleSettings = {
    calendars: [ ]
}