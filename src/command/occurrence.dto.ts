import {IBasicSearchDto} from "./dto";

export interface IOccurrenceSearchDto extends IBasicSearchDto {
    occurrenceDate?: Date;
    eventId?: bigint;
}

export interface IOccurrenceCreateDto {
    occurrenceDate?: Date;
    eventId: bigint;
}

export interface IOccurrenceUpdateDto {
    occurrenceDate?: Date;
    attendance?: number;
}
