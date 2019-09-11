import {Region} from "../util/types/region.type";
import {IBasicSearchDto} from "./dto";
import {Op} from "sequelize/types";
import {Weekday} from "../util/types/weekday.type";
import {INotificationTextCreateDto} from "./notificationText.dto";

export interface IEventSearchDto extends IBasicSearchDto {
    name?: string | { [Op.like]: string };
    region?: Region;
    weekDay?: Weekday;
    eventStartHour?: number;
    eventStartMinute?: number;
    eventEndHour?: number;
    eventEndMinute?: number;
}

export interface IEventCreateDto {
    name: string;
    description: string;
    region: Region;
    foreignServerSignUpChannel: string;
    memberSignUpChannel: string;
    eventStartHour: number;
    eventStartMinute: number;
    eventEndHour: number;
    eventEndMinute: number;
    weekDay: Weekday;
    numberOfNotifications: number;
    notificationTexts: INotificationTextCreateDto[];
    timeZone?: string;
    disabled?: boolean;
}

export interface IEventUpdateDto {
    name?: string;
    description?: string;
    region?: Region;
    foreignServerSignUpChannel?: string;
    memberSignUpChannel?: string;
    eventStartHour?: number;
    eventStartMinute?: number;
    eventEndHour?: number;
    eventEndMinute?: number;
    eventEnd?: string;
    weekDay?: Weekday;
    numberOfNotifications?: number;
    timeZone?: string;
    disabled?: boolean;
}
