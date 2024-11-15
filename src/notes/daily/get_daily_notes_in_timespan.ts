import { App, TFile } from "obsidian";
import getDailyNotesPlugin from "./get_daily_notes_plugin";
// This is a hack because jest refuses to work correctly with default import notation
const moment = require('moment').default || require('moment');

export default function getDailyNotesInTimespan(app: App, dates: {start?: Date, end?: Date}) {
    if(!dates.start && !dates.end) {
        throw 'The dates object needs at least one of start or end';
    }

    const dailyNotesPlugin = getDailyNotesPlugin(app);
    if(!dailyNotesPlugin?.enabled) {
        return null;
    }

    const settings = dailyNotesPlugin?.instance.options;
    // An empty settings.folder string is considered the same location as /, files in this directory have a parent path of /
    const dailyNotesFolder = settings.folder !== '' ? settings.folder : '/';
    // YYYY-MM-DD is Obsidian's default, if no specific format is configured the settings.format is undefined
    const dateFormat = settings.format || 'YYYY-MM-DD';

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
    startMoment?: moment.Moment,
    endMoment?: moment.Moment): boolean {

    if (file.parent?.path !== dailyNotesFolder) {
        return false;
    }

    let parsedDate = moment(file.basename, dateFormat, true);
    if(!parsedDate.isValid) {
        return false;
    }

    // Both dates are specified, so we check if the date lies between them
    if (startMoment && endMoment) {
        return parsedDate.isBetween(startMoment, endMoment, 'day', '[]');
    }

    // There is a startMoment, so we know there is no endMoment, so we check if the date lies after startMoment
    if (startMoment) {
        return parsedDate.isAfter(startMoment);
    }

    // There is no startMoment, but we know there is an endMoment, so we check if the date lies before endMoment
    return parsedDate.isBefore(endMoment);
}
