import { DateSelectArg, DatesSetArg, EventApi, EventClickArg, EventHoveringArg } from "@fullcalendar/core";

export default interface CalendarConfig {
    datesSet?: (arg: DatesSetArg) => void;
    eventClick?: (info: EventClickArg) => void;
    select?: (args: DateSelectArg) => Promise<void>;
    modifyEvent?: (event: EventApi, oldEvent: EventApi) => Promise<boolean>;
    eventMouseEnter?: (info: EventHoveringArg) => void;
    firstDay?: number;
    initialView?: { desktop: string; mobile: string };
    openContextMenuForEvent?: (
        event: EventApi,
        mouseEvent: MouseEvent
    ) => Promise<void>;
    toggleTask?: (event: EventApi, isComplete: boolean) => Promise<boolean>;
    forceNarrow?: boolean;
}