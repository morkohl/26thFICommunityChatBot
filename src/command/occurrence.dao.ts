import {IBasicSearchDao} from "./dao";

export interface IOccurrenceSearchDao extends IBasicSearchDao {
    occurrenceDate?: Date;
    eventId?: bigint;
}

export interface IOccurrenceCreateDao {
    occurrenceDate?: Date;
    eventId: bigint;
}

export interface IOccurrenceUpdateDao {
    occurrenceDate?: Date;
    attendance?: number;
}
