import { App, TFile } from "obsidian";
import getDailyNotesPlugin from "./get_daily_notes_plugin";
import * as moment from "moment";
import { Moment } from "moment";

export default async function getDailyNotesInTimespanAsync(app: App, dates: {start?: Date, end?: Date}) {
    if(!dates.start && !dates.end) {
        throw 'The dates object needs at least one of start or end';
    }

    const dailyNotesPlugin = getDailyNotesPlugin(app);
    if(!dailyNotesPlugin?.enabled) {
        return null;
    }

    const settings = dailyNotesPlugin?.instance.options;
    const dailyNotesFolder = settings.folder;
    const dateFormat = settings.format;

    const startMoment = convertToMoment(dates.start);
    const endMoment = convertToMoment(dates.end);

    const files = app.vault.getFiles();
    return files.filter(file => checkFileInRange(file, dailyNotesFolder, dateFormat, startMoment, endMoment));
}

function convertToMoment(date?: Date) {
    return date
        ? moment(date)
        : undefined;
}

function checkFileInRange(
    file: TFile,
    dailyNotesFolder: string,
    dateFormat: string,
    startMoment?: Moment,
    endMoment?: Moment): boolean {

    if (!file.path.startsWith(dailyNotesFolder)) {
        return false;
    }

    let parsedDate: Moment;
    try {
        parsedDate = moment(file.name, dateFormat, true);
    }
    catch {
        return false;
    }

    // Both dates are specified, so we check if the date lies between them
    if (startMoment && endMoment) {
        return parsedDate.isBetween(startMoment, endMoment);
    }

    // There is a startMoment, so we know there is no endMoment, so we check if the date lies after startMoment
    if (startMoment) {
        return parsedDate.isAfter(startMoment);
    }

    // There is no startMoment, but we know there is an endMoment, so we check if the date lies before endMoment
    return parsedDate.isBefore(endMoment);
}
