export default interface ObsidianChronicleSettings {
    input: string;
    calendars: ObsidianChronicleCalendarSetting[];
}

export interface ObsidianChronicleCalendarSetting {
    name: string;
    directory: string;
    colour: string;
}

export const DEFAULT_SETTINGS : ObsidianChronicleSettings = {
    input: 'this is the default value',
    calendars: [
        { name: 'Main', directory: '/', colour: '#d3d3d3' },
        { name: 'Main', directory: '/', colour: '#d3d3d3' },
    ]
}