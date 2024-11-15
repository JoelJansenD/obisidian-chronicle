export default interface DailyNotesPlugin {
    enabled: boolean;
    instance: DailyNotes;
}

export interface DailyNotes {
    options: {
        folder: string,
        format: string,
        template: string,
    };
}