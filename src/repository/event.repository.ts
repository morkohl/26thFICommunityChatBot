import {CRUDRepository} from "./repository";
import {IEventCreateDto, IEventSearchDto, IEventUpdateDto} from "../command/event.dto";
import Occurrence from "../model/occurrence.model";
import NotificationText from "../model/notificationText.model";
import Event from "../model/event.model";
import {Scope} from "../util/types/modelUtilTypes.type";

export class EventRepository extends CRUDRepository<Event> {

    constructor() {
        super(Event);
    }

    public async create(dto: IEventCreateDto, scope?: Scope): Promise<Event> {
        return super.create(dto, scope);
    }

    public async delete(dto?: IEventSearchDto): Promise<number> {
        return super.delete(dto);
    }

    public async search(dto: IEventSearchDto, scope?: Scope): Promise<Event[]> {
        return super.search(dto, scope);
    }

    public async searchOne(dto: IEventSearchDto, scope?: Scope): Promise<Event | null> {
        return super.searchOne(dto, scope);
    }

    public async update(searchDto: IEventSearchDto, updateDto: IEventUpdateDto, scope?: Scope): Promise<Event | null> {
        return super.update(searchDto, updateDto);
    }

    public getDefaultScope(): Scope {
        return [Occurrence, NotificationText];
    }
}
