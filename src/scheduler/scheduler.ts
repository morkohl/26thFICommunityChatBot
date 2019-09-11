import {Service} from "typedi";
import Event from "../model/event.model";
import {CronJob, CronCommand, job} from "cron";

@Service()
export class EventScheduler {
    constructor(private scheduledEventsById: Map<bigint, Event>, private scheduledJobsById: Map<bigint, CronJob[]>) {

    }

    public scheduleEvent(event: Event, onTick: CronCommand, onComplete?: CronCommand): CronJob[] {
        const cronJobs = event.cronJobExpressions()
            .map((cron) => job({
                cronTime: cron.toString(),
                onTick,
                onComplete,
                start: true,
                timeZone: cron.timeZone,
                unrefTimeout: true,
            }));

        this.scheduledJobsById.set(event.id, cronJobs);
        this.scheduledEventsById.set(event.id, event);

        return cronJobs;
    }

    public getJobsForEvent(eventId: bigint): CronJob[] {
        return this.scheduledJobsById.has(eventId) ? this.scheduledJobsById.get(eventId) : [];
    }

    public isScheduled(eventId: bigint): boolean {
        return this.scheduledEventsById.has(eventId);
    }
}
