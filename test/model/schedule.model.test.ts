import * as chai from "chai";
import Schedule from "../../src/model/schedule.model";
import Event from "../../src/model/event.model";
import {Database} from "../../src/model/database";
import {defaultDatabaseConfig} from "../../src/config/db.config";
import {ValidationError} from "sequelize";
import {EventRepositoryBDDUtils} from "../repository/event.repository.test";

const expect = chai.expect;

chai.use(require("chai-as-promised"));

describe("Schedule Model", () => {

    before(async () => {
        const db = new Database(defaultDatabaseConfig);

        await db.connect();
    });

    afterEach(async () => {
        await Schedule.truncate();
    });

    describe("Custom Column Value Validation", () => {

        const scheduleValues = {
            eventStart: "2pm",
            eventEnd: "3:30pm",
            eventId: 1,
            weekDay: "monday",
        };

        it("should throw a validation error if any columns are null", () => {
            return expect(Schedule.create()).to.be.rejectedWith(ValidationError,
                "notNull Violation: Schedule.weekDay cannot be null,\n" +
                "notNull Violation: Schedule.eventStart cannot be null,\n" +
                "notNull Violation: Schedule.eventEnd cannot be null,\n" +
                "notNull Violation: Schedule.eventId cannot be null");
        });

        it("should throw a validation error if any string columns are empty", () => {
            return expect(Schedule.create({
                ...scheduleValues,
                eventStart: "",
                eventEnd: "",
                weekDay: ""
            })).to.be.rejectedWith(ValidationError, /.*notEmpty.*/);
        });

        it("should throw a validation error if the weekday provided is invalid", () => {
            return expect(Schedule.create({
                ...scheduleValues,
                weekDay: "not a weekday"
            })).to.be.rejectedWith(ValidationError,
                "Schedule.weekDay must be a lower-cased weekday")
        });

        it("should throw a validation error if the eventStart provided is invalid", () => {
            return expect(Schedule.create({
                ...scheduleValues,
                eventStart: "24am",
            })).to.be.rejectedWith(ValidationError,
                "Schedule.eventStart must be a time expression (1-12am) or (1-12pm)")
        });

        it("should throw a validation error if the eventEnd provided is invalid", () => {
            return expect(Schedule.create({
                eventStart: "1:30pm",
                eventEnd: "24am",
                eventId: 1,
                weekDay: "monday"
            })).to.be.rejectedWith(ValidationError,
                "Schedule.eventEnd must be a time expression (1-12am) or (1-12pm)"
            )
        });

        it("should throw a validation error if the numberOfNotifications provided is not an integer", () => {
            return expect(Schedule.create({
                ...scheduleValues,
                numberOfNotifications: 2.1,
            })).to.be.rejectedWith(ValidationError,
                "Validation isInt on numberOfNotifications failed");
        });

        it("should throw a validation error if the numberOfNotifications provided is above the maximum", () => {
            return expect(Schedule.create({
                ...scheduleValues,
                numberOfNotifications: 6,
            })).to.be.rejectedWith(ValidationError,
                "Validation max on numberOfNotifications failed");
        });

        it("should throw a validation error if the numberOfNotifications provided is below the minimum", () => {
            return expect(Schedule.create({
                ...scheduleValues,
                numberOfNotifications: 0,
            })).to.be.rejectedWith(ValidationError,
                "Validation min on numberOfNotifications failed");
        });
    });

    describe("Hooks", () => {

        let event: Event;

        before(async () => {
            event = await Event.create(EventRepositoryBDDUtils.eventTemplate);
        });

        after(async () => {
            await Event.truncate();
        });

        const scheduleValues = {
            eventStart: "2pm",
            eventEnd: "3pm",
            weekDay: "monday"
        };

        it("should set cron expressions when creating", async () => {
            const schedule = await Schedule.create({
                ...scheduleValues,
                eventId: event.id
            });

            expect(schedule.cronSchedule).to.not.be.undefined.and.to.not.be.null;
            expect(schedule.cronScheduleEarly).to.not.be.undefined.and.to.not.be.null;
        });

        it("should set cron expressions when updating", async () => {
            const schedule = await Schedule.create({
                ...scheduleValues,
                eventId: event.id
            });

            const cronSchedule = schedule.cronSchedule;
            const cronScheduleEarly = schedule.cronScheduleEarly;

            const updatedScheduleValues = {
                ...scheduleValues,
                eventStart: "1am",
            };

            await Schedule.update(updatedScheduleValues, { where: { id: schedule.id }});

            const updatedSchedule = await Schedule.findByPk(schedule.id);

            expect(updatedSchedule.cronSchedule).to.not.be.undefined.and.to.not.be.null.and.to.not.eq(cronSchedule);
            expect(updatedSchedule.cronScheduleEarly).to.not.be.undefined.and.to.not.be.null.and.to.not.eq(cronScheduleEarly);
        });

        it("should lowercase the weekday attribute to not get a validation error", async () => {
            const scheduleValuesFaultyWeekDay = {
                ...scheduleValues,
                eventId: event.id,
                weekDay: "MONDAY",
            };

            const schedule = Schedule.build(scheduleValuesFaultyWeekDay);

            return expect(schedule.validate()).to.be.fulfilled;
        })
    });
});
