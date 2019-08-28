import {CronExpressionFactory} from "../src/builder/CronExpressionFactory";
import * as chai from "chai";

const expect = chai.expect;

describe("Cron Expression Factory Test", () => {
    it("should create a cron expression", () => {
        const weekDay = "monday";
        const numberOfNotifications = 2;
        const eventStart = "11pm";

        const cronExpression = CronExpressionFactory.getCronExpression(eventStart, weekDay, numberOfNotifications);

        expect(cronExpression).to.eq("0/30 22 * * 1");
    });

    it("should set 0 as the minute of the schedule if there is only supposed to be one notificaion", () => {
        const weekDay = "monday";
        const numberOfNotifications = 2;
        const eventStart = "2am";

        const cronExpression = CronExpressionFactory.getCronExpression(eventStart, weekDay, numberOfNotifications);

        expect(cronExpression).to.eq("0/30 1 * * 1");
    });
    it("should set the hours to 23 if midnight was chosen as event start", () => {
        const weekDay = "monday";
        const numberOfNotifications = 2;
        const eventStart = "12pm";

        const cronExpression = CronExpressionFactory.getCronExpression(eventStart, weekDay, numberOfNotifications);

        expect(cronExpression).to.eq("0/30 23 * * 1");
    });

    it("should set the hours to 11 if noon was chosen as event start", () => {
        const weekDay = "monday";
        const numberOfNotifications = 2;
        const eventStart = "12am";

        const cronExpression = CronExpressionFactory.getCronExpression(eventStart, weekDay, numberOfNotifications);

        expect(cronExpression).to.eq("0/30 11 * * 1");
    });
});
