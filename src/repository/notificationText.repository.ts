import NotificationText from "../model/notificationText.model";
import {CRDRepository} from "./repository";
import {INotificationTextCreateDao, INotificationTextSearchDao} from "../command/notificationText.dao";
import {Service} from "typedi";

@Service()
export class NotificationTextRepository extends CRDRepository<NotificationText> {

    constructor() {
        super(NotificationText);
    }

    public async search(dao: INotificationTextSearchDao): Promise<NotificationText[]> {
        return super.search(dao);
    }

    public async searchOne(dao: INotificationTextSearchDao): Promise<NotificationText | null> {
        return super.searchOne(dao);
    }

    public async create(dao: INotificationTextCreateDao): Promise<NotificationText> {
        return super.create(dao);
    }

    public async delete(dao?: INotificationTextSearchDao): Promise<number> {
        return super.delete(dao);
    }
}
