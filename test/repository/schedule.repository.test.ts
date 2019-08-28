import Schedule from "../../src/model/schedule.model";
import {Database} from "../../src/model/database";
import {defaultDatabaseConfig} from "../../src/config/db.config";
import {ScheduleRepository} from "../../src/repository/schedule.repository";
import * as chai from "chai";
import {EventRepositoryBDDUtils} from "./event.repository.test";
import NotificationText from "../../src/model/notificationText.model";
import Event from "../../src/model/event.model";

const expect = chai.expect;

describe("Schedule Repository", () => {
    let testee: ScheduleRepository;
    let bddUtils: ScheduleRepositoryBDDUtils;

    before(async () => {
        const db: Database = new Database(defaultDatabaseConfig);

        await db.connect();

        bddUtils = new ScheduleRepositoryBDDUtils();
        testee = new ScheduleRepository();
    });

    afterEach(async () => {
        await bddUtils.clear();
    });

    describe("Searching Schedules", () => {
        describe("Searching one", () => {

            it("should find a schedule given its id", async () => {
                const expectedSchedule = await bddUtils.givenOneSchedule();
                const actualSchedule = await testee.searchOne({id: BigInt(expectedSchedule.id)});

                bddUtils.expectScheduleIsValid(actualSchedule, expectedSchedule);
            });

            it("should find a schedule given its eventStart", async () => {
                const expectedSchedule = await bddUtils.givenOneSchedule();
                const actualSchedule = await testee.searchOne({eventStart: expectedSchedule.eventStart});

                bddUtils.expectScheduleIsValid(actualSchedule, expectedSchedule);

            });

            it("should find a schedule given its eventStart", async () => {
                const expectedSchedule = await bddUtils.givenOneSchedule();
                const actualSchedule = await testee.searchOne({eventEnd: expectedSchedule.eventEnd});

                bddUtils.expectScheduleIsValid(actualSchedule, expectedSchedule);
            });

            it("should find a schedule given an event id", async () => {
                const givenEvent = await bddUtils.eventRepositoryBddUtils.givenOneEvent();
                let eventId = BigInt(givenEvent.id);

                const expectedSchedule = givenEvent.schedule;
                const actualSchedule = await testee.searchOne({ eventId });

                bddUtils.expectScheduleIsValid(actualSchedule, expectedSchedule);
            });
        });

        describe("Searching many", () => {

            it("should find many schedules given a day of the week", async () => {
                const expectedSchedules = await bddUtils.givenManySchedules(3);

                const actualSchedules = await testee.search({
                    weekDay: ScheduleRepositoryBDDUtils.scheduleTemplate.weekDay,
                });

                bddUtils.expectSchedulesAreValid(actualSchedules, expectedSchedules);
            });
        });
    });

    describe("Creating Schedules", () => {
        it("should create a schedule with related data", async () => {
            const event = await bddUtils.eventRepositoryBddUtils.givenOneEvent();
            const schedule = await testee.create({
                ...ScheduleRepositoryBDDUtils.scheduleTemplate,
                eventId: BigInt(event.id),
            });

            bddUtils.expectScheduleIsValid(schedule, ScheduleRepositoryBDDUtils.mockDatabaseSchedule);
        });
    });

    describe("Updating Schedules", () => {

        it("should update a schedule", async () => {
            const initialSchedule = await bddUtils.givenOneSchedule();
            const updatedSchedule = await testee.update({
                id: BigInt(initialSchedule.id),
            }, {
                numberOfNotifications: 3,
            });

            bddUtils.expectScheduleIsValid(updatedSchedule, {
                ...ScheduleRepositoryBDDUtils.scheduleTemplate,
                numberOfNotifications: 3,
            });
        });
    });

    describe("Deleting Schedules", () => {

        it("should delete a schedule given its id", async () => {
            const schedule = await bddUtils.givenOneSchedule();

            return expect(testee.delete({id: BigInt(schedule.id)})).to.eventually.equal(1);
        });

        it("should delete a schedule given its eventStart", async () => {
            const schedule = await bddUtils.givenOneSchedule();

            return expect(testee.delete({eventStart: schedule.eventStart})).to.eventually.equal(1);
        });

        it("should delete a schedule given its eventEnd", async () => {
            const schedule = await bddUtils.givenOneSchedule();

            return expect(testee.delete({eventEnd: schedule.eventEnd})).to.eventually.equal(1);
        });

        it("should delete many schedules given a day of the week", async () => {
            const weekDay = ScheduleRepositoryBDDUtils.scheduleTemplate.weekDay;

            await bddUtils.givenManySchedules();

            return expect(testee.delete({weekDay})).to.eventually.equal(5);
        });

        it("should delete related data", async () => {
            const schedule = await bddUtils.givenOneSchedule();

            await testee.delete({id: BigInt(schedule.id)});

            // @ts-ignore
            const notificationTexts = await NotificationText.findAll({ where: { scheduleId: schedule.id}});
            const events = await Event.findAll();

            expect(notificationTexts).to.be.empty;
            expect(events).to.not.be.empty;
        });
    });
});

export class ScheduleRepositoryBDDUtils {

    public static scheduleTemplate: any = EventRepositoryBDDUtils.eventTemplate.schedule;

    public static mockDatabaseSchedule = EventRepositoryBDDUtils.mockDatabaseEvent.schedule;

    public eventRepositoryBddUtils: EventRepositoryBDDUtils;

    constructor() {
        this.eventRepositoryBddUtils = new EventRepositoryBDDUtils();
    }

    public async givenOneSchedule(): Promise<Schedule> {
        const event = await this.eventRepositoryBddUtils.givenOneEvent();

        return event.schedule;
    }

    public async givenManySchedules(amount: number = 5) {
        let event: Event;
        const schedules: Schedule[] = [];

        for (let i = 0; i < amount; i++) {
            event = await this.eventRepositoryBddUtils.givenOneEvent();
            schedules.push(event.schedule);
        }

        return schedules;
    }

    public async clear(): Promise<void> {
        await Schedule.truncate();
        return Event.truncate();
    }

    public expectSchedulesAreValid(actualSchedules: any[], expectedSchedules: any[]): void {
        expect(actualSchedules.length).to.eq(expectedSchedules.length);

        for (let i = 0; i < actualSchedules.length; i++) {
            this.expectScheduleIsValid(actualSchedules[i], expectedSchedules[i]);
        }
    }

    public expectScheduleIsValid(actualSchedule: any, expectedSchedule: any): void {
        expect(actualSchedule).to.not.be.null;

        expect(Number(actualSchedule.id)).to.be.at.least(0);
        expect(Number(actualSchedule.eventId)).to.be.at.least(0);
        expect(actualSchedule.eventStart).to.eq(expectedSchedule.eventStart);
        expect(actualSchedule.eventEnd).to.eq(expectedSchedule.eventEnd);
        expect(actualSchedule.numberOfNotifications).to.eq(expectedSchedule.numberOfNotifications);
        expect(actualSchedule.weekDay).to.not.be.undefined;
        expect(actualSchedule.createdAt).to.be.an.instanceof(Date);
        expect(actualSchedule.updatedAt).to.be.an.instanceof(Date);

        expect(actualSchedule.notificationTexts.length).to.eq(expectedSchedule.notificationTexts.length);

        for (let i = 0; i < expectedSchedule.notificationTexts.length; i++) {
            expect(Number(actualSchedule.notificationTexts[i].id)).to.be.at.least(0);
            expect(Number(actualSchedule.notificationTexts[i].scheduleId)).to.be.at.least(0);
            expect(actualSchedule.notificationTexts[i].text).to.eq(expectedSchedule.notificationTexts[i].text);
            expect(actualSchedule.notificationTexts[i].createdAt).to.be.an.instanceof(Date);
            expect(actualSchedule.notificationTexts[i].updatedAt).to.be.an.instanceof(Date);
        }

    }
}
