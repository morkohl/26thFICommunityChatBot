import {Service} from "typedi";
import Schedule from "../model/schedule.model";
import {CRUDRepository} from "./repository";
import {IScheduleCreateDao, IScheduleSearchDao, IScheduleUpdateDao} from "../command/schedule.dao";
import NotificationText from "../model/notificationText.model";
import {Scope} from "../types/modelUtilTypes.type";

@Service()
export class ScheduleRepository extends CRUDRepository<Schedule> {

    constructor() {
        super(Schedule);
    }

    public async create(dao: IScheduleCreateDao, scope?: Scope): Promise<Schedule> {
        return super.create(dao, scope);
    }

    public async delete(dao?: IScheduleSearchDao): Promise<number> {
        return super.delete(dao);
    }

    public async search(dao: IScheduleSearchDao, scope?: Scope): Promise<Schedule[]> {
        return super.search(dao, scope);
    }

    public async searchOne(dao: IScheduleSearchDao, scope?: Scope): Promise<Schedule | null> {
        return super.searchOne(dao, scope);
    }

    public async update(searchDao: IScheduleSearchDao, updateDao: IScheduleUpdateDao, scope?: Scope): Promise<Schedule | null> {
        return super.update(searchDao, updateDao, scope);
    }

    public getDefaultScope(): Scope {
        return [NotificationText];
    }
}
