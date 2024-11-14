export interface ChronicleCalendar {
    id: string;
    name: string;
    colour: string;
    type: ChronicleCalendarType;
}

export class ChronicleFullCalendar implements ChronicleCalendar {
    id: string;
    name: string;
    colour: string;

    readonly type = 'full';
    directory: string;
}

export class ChronicleDailyCalendar implements ChronicleCalendar {
    id: string;
    name: string;
    colour: string;
    
    readonly type = 'daily';
}

export type ChronicleCalendarType = 'full' | 'daily';