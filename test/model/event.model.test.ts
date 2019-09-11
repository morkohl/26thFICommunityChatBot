import Event from "../../src/model/event.model";
import {Database} from "../../src/model/database";
import {defaultDatabaseConfig} from "../../src/config/db.config";
import {ValidationError} from "sequelize";
import * as chai from "chai";
import {CronExpression} from "../../src/scheduler/CronExpression";

const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe("Event Model", () => {
    before(async () => {
        const db = new Database(defaultDatabaseConfig);

        await db.connect();
    });

    after(async () => {
        await Event.truncate();
    });

    const eventValues = {
        name: "test event",
        description: "a test event",
        foreignServerSignUpChannel: "some-server",
        memberSignUpChannel: "some channel",
        region: "EU",
        eventStartHour: 2,
        eventStartMinute: 30,
        eventEndHour: 3,
        eventEndMinute: 30,
        weekDay: "monday",
    };

    describe("Column Value Validation", () => {

        const double = 12.54;

        it("should throw a validation error if any columns are null", () => {
            return expect(Event.create()).to.be.rejectedWith(ValidationError,
                "notNull Violation: Event.name cannot be null,\n" +
                "notNull Violation: Event.description cannot be null,\n" +
                "notNull Violation: Event.region cannot be null,\n" +
                "notNull Violation: Event.foreignServerSignUpChannel cannot be null,\n" +
                "notNull Violation: Event.memberSignUpChannel cannot be null,\n" +
                "notNull Violation: Event.weekDay cannot be null,\n" +
                "notNull Violation: Event.eventStartHour cannot be null,\n" +
                "notNull Violation: Event.eventStartMinute cannot be null,\n" +
                "notNull Violation: Event.eventEndHour cannot be null,\n" +
                "notNull Violation: Event.eventEndMinute cannot be null"
            );
        });

        it("should throw a validation error if any string columns are empty", () => {
            return expect(Event.create({
                ...eventValues,
                description: "",
                name: "",
                foreignServerSignUpChannel: "",
                memberSignUpChannel: "",
                region: "",
                weekDay: ""
            })).to.be.rejectedWith(ValidationError, /.*notEmpty.*/);
        });

        it("should throw a validation error if the provided region is invalid", () => {
            return expect(Event.create({
                ...eventValues,
                region: "not a valid region"
            })).to.be.rejectedWith(ValidationError, "Event.region has to be either \"NA\" or \"EU\"");
        });

        it("should throw a validation error if the weekday provided is invalid", () => {
            return expect(Event.create({
                ...eventValues,
                weekDay: "not a weekday"
            })).to.be.rejectedWith(ValidationError,
                "Event.weekDay must be a lower-cased weekday")
        });

        it("should throw a validation error if the eventStart provided is not an integer", () => {
            return expect(Event.create({
                ...eventValues,
                eventStartHour: double,
                eventStartMinute: double,
            })).to.be.rejectedWith(ValidationError,
                "Validation error: Validation isInt on eventStartHour failed,\n" +
                "Validation error: Validation isInt on eventStartMinute failed"
            )
        });

        it("should throw a validation error if the eventStart provided is below the minimum", () => {
            return expect(Event.create({
                ...eventValues,
                eventStartHour: -1,
                eventStartMinute: -1,
            })).to.be.rejectedWith(ValidationError,
                "Validation error: Validation min on eventStartHour failed,\n" +
                "Validation error: Validation min on eventStartMinute failed")
        });

        it("should throw a validation error if the eventStart provided is above the maximum", () => {
            return expect(Event.create({
                ...eventValues,
                eventStartHour: 24,
                eventStartMinute: 60,
            })).to.be.rejectedWith(ValidationError,
                "Validation error: Validation max on eventStartHour failed,\n" +
                "Validation error: Validation max on eventStartMinute failed")
        });

        it("should throw a validation error if the eventEnd provided is not an integer", () => {
            return expect(Event.create({
                ...eventValues,
                eventEndHour: double,
                eventEndMinute: double,
            })).to.be.rejectedWith(ValidationError,
                "Validation error: Validation isInt on eventEndHour failed,\n" +
                "Validation error: Validation isInt on eventEndMinute failed"
            )
        });

        it("should throw a validation error if the eventEnd provided is below the minimum", () => {
            return expect(Event.create({
                ...eventValues,
                eventEndHour: -1,
                eventEndMinute: -1,
            })).to.be.rejectedWith(ValidationError,
                "Validation error: Validation min on eventEndHour failed,\n" +
                "Validation error: Validation min on eventEndMinute failed")
        });

        it("should throw a validation error if the eventEnd provided is above the maximum", () => {
            return expect(Event.create({
                ...eventValues,
                eventEndHour: 24,
                eventEndMinute: 60,
            })).to.be.rejectedWith(ValidationError,
                "Validation error: Validation max on eventEndHour failed,\n" +
                "Validation error: Validation max on eventEndMinute failed")
        });

        it("should throw a validation error if the numberOfNotifications provided is not an integer", () => {
            return expect(Event.create({
                ...eventValues,
                numberOfNotifications: 2.1,
            })).to.be.rejectedWith(ValidationError,
                "Validation isInt on numberOfNotifications failed");
        });

        it("should throw a validation error if the numberOfNotifications provided is above the maximum", () => {
            return expect(Event.create({
                ...eventValues,
                numberOfNotifications: 6,
            })).to.be.rejectedWith(ValidationError,
                "Validation Max on numberOfNotifications failed");
        });

        it("should throw a validation error if the numberOfNotifications provided is below the minimum", () => {
            return expect(Event.create({
                ...eventValues,
                numberOfNotifications: 0,
            })).to.be.rejectedWith(ValidationError,
                "Validation Min on numberOfNotifications failed");
        });
    });

    describe("Sequelize Hooks", () => {

        it("should uppercase the region argument to not get a validation error", () => {
            const event: Event = Event.build({
                ...eventValues,
                region: "eu"
            });

            return expect(event.validate()).to.be.fulfilled;
        });

        it("should lowercase the weekday attribute to not get a validation error", () => {
            const event = Event.build({
                ...eventValues,
                weekDay: "MONDAY",
            });

            return expect(event.validate()).to.be.fulfilled;
        });
    });

    describe("Creating Notification Expressions", () => {
        it("should create a notification expression with only one hour in the hour expression", () => {
            const eventStartHour = 12;
            const eventStartMinute = 0;
            const weekDay = "monday";
            const numberOfNotifications = 1;

            const event = Event.build({
                ...eventValues,
                eventStartHour,
                eventStartMinute,
                weekDay,
                numberOfNotifications
            });

            const cronExpressions = event.cronJobExpressions();

            expect(cronExpressions).to.deep.eq([
                new CronExpression({
                    hour: 12,
                    minute: 0,
                    dayOfWeek: 1,
                })
            ])
        });

        it("should create a notification expression with more than one hour in the hour expression", () => {
            const eventStartHour = 12;
            const eventStartMinute = 0;
            const weekDay = "monday";
            const numberOfNotifications = 2;

            const event = Event.build({
                ...eventValues,
                eventStartHour,
                eventStartMinute,
                weekDay,
                numberOfNotifications
            });

            const cronExpressions = event.cronJobExpressions();


            expect(cronExpressions).to.deep.eq([
                new CronExpression({
                    hour: `11-12`,
                    minute: 0,
                    dayOfWeek: 1,
                })
            ])
        });

        it("should create a notification expression with minutes", () => {
            const eventStartHour = 12;
            const eventStartMinute = 30;
            const weekDay = "monday";
            const numberOfNotifications = 2;

            const event = Event.build({
                ...eventValues,
                eventStartHour,
                eventStartMinute,
                weekDay,
                numberOfNotifications
            });

            const cronExpressions = event.cronJobExpressions();

            expect(cronExpressions).to.deep.eq([
                new CronExpression({
                    hour: `11-12`,
                    minute: 30,
                    dayOfWeek: 1,
                })
            ])
        });

        it("should create multiple notificationtexts if the job has to span across multiple days", () => {
            const eventStartHour = 0;
            const eventStartMinute = 0;
            const weekDay = "tuesday";

            const numberOfNotifications = 3;

            const event = Event.build({
                ...eventValues,
                eventStartHour,
                eventStartMinute,
                weekDay,
                numberOfNotifications
            });

            const cronExpressions = event.cronJobExpressions();

            expect(cronExpressions).to.deep.eq([
                new CronExpression({
                    hour: 0,
                    minute: 0,
                    dayOfWeek: 2,
                }),
                new CronExpression({
                    hour: "22-23",
                    minute: 0,
                    dayOfWeek: 1,
                })
            ])
        });

        it("should create multiple notificationtexts if the job spans across a monday and a sunday", () => {
            const eventStartHour = 0;
            const eventStartMinute = 0;
            const weekDay = "monday";

            const numberOfNotifications = 2;

            const event = Event.build({
                ...eventValues,
                eventStartHour,
                eventStartMinute,
                weekDay,
                numberOfNotifications
            });

            const cronExpressions = event.cronJobExpressions();

            expect(cronExpressions).to.deep.eq([
                new CronExpression({
                    hour: 0,
                    minute: 0,
                    dayOfWeek: 1,
                }),
                new CronExpression({
                    hour: 23,
                    minute: 0,
                    dayOfWeek: 0,
                })
            ])
        })

        it("should create multiple notificationtexts if the job spans across a multiple days with time ranges on the first and second day", () => {
            const eventStartHour = 2;
            const eventStartMinute = 0;
            const weekDay = "monday";

            const numberOfNotifications = 5;

            const event = Event.build({
                ...eventValues,
                eventStartHour,
                eventStartMinute,
                weekDay,
                numberOfNotifications
            });

            const cronExpressions = event.cronJobExpressions();

            expect(cronExpressions).to.deep.eq([
                new CronExpression({
                    hour: "0-2",
                    minute: 0,
                    dayOfWeek: 1,
                }),
                new CronExpression({
                    hour: "22-23",
                    minute: 0,
                    dayOfWeek: 0,
                })
            ])
        })
    })
});
