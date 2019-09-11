import NotificationText from "../model/notificationText.model";
import {CRDRepository} from "./repository";
import {INotificationTextCreateDto, INotificationTextSearchDto} from "../command/notificationText.dto";
import {Service} from "typedi";

@Service()
export class NotificationTextRepository extends CRDRepository<NotificationText> {

    constructor() {
        super(NotificationText);
    }

    public async search(dao: INotificationTextSearchDto): Promise<NotificationText[]> {
        return super.search(dao);
    }

    public async searchOne(dao: INotificationTextSearchDto): Promise<NotificationText | null> {
        return super.searchOne(dao);
    }

    public async create(dao: INotificationTextCreateDto): Promise<NotificationText> {
        return super.create(dao);
    }

    public async delete(dao?: INotificationTextSearchDto): Promise<number> {
        return super.delete(dao);
    }
}
