export default interface DailyNotesPlugin {
    enabled: boolean;
    instance: DailyNotes;
}

export interface DailyNotes {
    options: { [key: string]: string };
}