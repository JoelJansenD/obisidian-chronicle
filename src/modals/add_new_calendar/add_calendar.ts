import validateCalendar from "@src/calendars/validate_calendar";
import { ChronicleCalendar, ChronicleSettings } from "@src/settings/chronicle_settings";

export default function addCalendar(settings: ChronicleSettings, newCalendar: ChronicleCalendar) {
    const validationResult = validateCalendar(newCalendar);
    if(validationResult.length > 0) {
        return validationResult;
    }

    settings.calendars.push(newCalendar);
    return null;
}