export type ChronicleSettings = {
    calendars: ChronicleCalendar[];
}

export type ChronicleCalendar = {
    id: string;
    name: string;
    directory: string;
    colour: string;
}