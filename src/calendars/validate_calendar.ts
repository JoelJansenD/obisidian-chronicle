import { ChronicleCalendar } from "@src/settings/obsidian_chronicle_settings";

export default function validateCalendar(calendar: ChronicleCalendar) {
    const validationProblems: string[] = [];
    if(!calendar.directory) {
        validationProblems.push('You must select a directory to store notes');
    }
    return validationProblems;
}