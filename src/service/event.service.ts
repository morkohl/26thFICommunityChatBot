import Event from "../model/event.model";
import {EventRepository} from "../repository/event.repository";
import {Inject, Service} from "typedi";
import {IEventCreateDto, IEventSearchDto, IEventUpdateDto} from "../command/event.dto";
import {EventScheduler} from "../scheduler/scheduler";
import {CronJob} from "cron";

@Service()
export class EventService {

    constructor(@Inject() private eventRepository: EventRepository,
                @Inject() private eventScheduler: EventScheduler) {
    }

    public async findEvent(event: bigint | IEventSearchDto): Promise<Event> {
        let foundEvent: Event | null;

        if (typeof event === "bigint") {
            foundEvent = await this.eventRepository.searchOne({id: event});
            if (foundEvent === null) {
                throw new Error(`Event for id ${event} does not exist`);
            }
        } else {
            foundEvent = await this.eventRepository.searchOne(event);

            if (foundEvent === null) {
                throw new Error(`Event does not exist`);
            }
        }

        return foundEvent;
    }

    public async createEvent(createDto: IEventCreateDto): Promise<Event> {
        return this.eventRepository.create(createDto);
    }

    public async udpateEvent(event: bigint | IEventSearchDto, updateDto: IEventUpdateDto): Promise<Event> {
        let updatedEvent: Event | null;

        if (typeof event === "bigint") {
            updatedEvent = await this.eventRepository.update({ id: event}, updateDto);
        } else {
            updatedEvent = await this.eventRepository.update(event, updateDto);
        }

        if (updatedEvent === null) {
            throw new Error("Event could not be updated because it does not exist");
        }

        return updatedEvent;
    }

    public async deleteEvent(event: bigint | IEventSearchDto): Promise<number> {
        if (typeof event === "bigint") {
            return this.eventRepository.delete({ id: event});
        } else {
            return await this.eventRepository.delete(event);
        }

    }

    public async scheduleEvent(eventId: bigint): Promise<CronJob[]> {
        if (this.eventScheduler.isScheduled(eventId)) {
            throw new Error("Event is already scheduled");
        }

        const event: Event = await this.findEvent(eventId);

        return this.eventScheduler.scheduleEvent(event, () => {
            return console.log("running!");
        });
    }
}
