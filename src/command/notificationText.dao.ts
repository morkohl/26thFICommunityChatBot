import {IBasicSearchDao} from "./dao";

export interface INotificationTextSearchDao extends IBasicSearchDao {
    text?: string;
    scheduleId?: bigint;
}

export interface INotificationTextCreateDao {
    scheduleId?: bigint;
    text: string;
}
