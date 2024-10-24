import { Guid } from "guid-typescript";

export default interface ObsidianChronicleSettings {
    calendars: ObsidianChronicleCalendarSetting[];
}

export interface ObsidianChronicleCalendarSetting {
    id: Guid;
    name: string;
    directory: string;
    colour: string;
}

export const DEFAULT_SETTINGS : ObsidianChronicleSettings = {
    calendars: [ ]
}