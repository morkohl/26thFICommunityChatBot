import {CRUDRepository} from "./repository";
import {IEventCreateDao, IEventSearchDao, IEventUpdateDao} from "../command/event.dao";
import Schedule from "../model/schedule.model";
import Occurrence from "../model/occurrence.model";
import Event from "../model/event.model";
import {Scope} from "../types/modelUtilTypes.type";

export class EventRepository extends CRUDRepository<Event> {

    constructor() {
        super(Event);
    }

    public async create(dao: IEventCreateDao, scope?: Scope): Promise<Event> {
        return super.create(dao, scope);
    }

    public async delete(dao?: IEventSearchDao): Promise<number> {
        return super.delete(dao);
    }

    public async search(dao: IEventSearchDao, scope?: Scope): Promise<Event[]> {
        return super.search(dao, scope);
    }

    public async searchOne(dao: IEventSearchDao, scope?: Scope): Promise<Event | null> {
        return super.searchOne(dao, scope);
    }

    public async update(searchDao: IEventSearchDao, updateDao: IEventUpdateDao, scope?: Scope): Promise<Event | null> {
        delete updateDao.schedule;
        return super.update(searchDao, updateDao);
    }

    public getDefaultScope(): Scope {
        return [Occurrence, {model: Schedule, include: [{all: true}]}];
    }
}
