import {INotificationTextCreateDao} from "./notificationText.dao";
import {IBasicSearchDao} from "./dao";
import {Weekday} from "../types/weekday.type";

export interface IScheduleSearchDao extends IBasicSearchDao {
    id?: bigint;
    weekDay?: Weekday;
    eventStart?: string;
    eventEnd?: string;
    eventId?: bigint;
}

export interface IScheduleCreateDao {
    eventId?: bigint;
    eventStart: string;
    eventEnd: string;
    weekDay: Weekday,
    numberOfNotifications: number;
    notificationTexts: INotificationTextCreateDao[];
}

export interface IScheduleUpdateDao {
    eventStart?: string;
    eventEnd?: string;
    numberOfNotifications?: number;
    notificationTexts?: INotificationTextCreateDao[];
}
