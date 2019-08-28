import {IScheduleCreateDao, IScheduleUpdateDao} from "./schedule.dao";
import {Region} from "../types/region.type";
import {IBasicSearchDao} from "./dao";
import {Op} from "sequelize/types";

export interface IEventSearchDao extends IBasicSearchDao {
    name?: string | { [Op.like]: string };
    region?: Region;
}

export interface IEventCreateDao {
    name: string;
    description: string;
    region: Region;
    foreignServerSignUpChannel: string;
    memberSignUpChannel: string;
    schedule: IScheduleCreateDao;
    disabled?: boolean;
}

export interface IEventUpdateDao {
    name?: string;
    description?: string;
    region?: Region;
    foreignServerSignUpChannel?: string;
    memberSignUpChannel?: string;
    schedule?: IScheduleUpdateDao;
    disabled?: boolean;
}
