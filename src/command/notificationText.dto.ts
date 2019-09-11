import {IBasicSearchDto} from "./dto";

export interface INotificationTextSearchDto extends IBasicSearchDto {
    text?: string;
    eventId?: bigint;
}

export interface INotificationTextCreateDto {
    eventId?: bigint;
    text: string;
}
