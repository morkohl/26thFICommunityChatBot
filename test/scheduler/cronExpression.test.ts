import * as chai from "chai";
import {CronExpression} from "../../src/scheduler/CronExpression";

const expect = chai.expect;

describe("Cron Expression Test", () => {

    it("should return a cron expression", () => {
        const cronExpression = new CronExpression({
            minute: 20,
            hour: "2-3",
            dayOfWeek: 6,
            month: "*",
            dayOfMonth: "28"
        });

        expect(cronExpression.toString()).to.eq("20 2-3 * 28 6");
    });

    it("should default to the \"*\" keyword if no value was provided", () => {
        const cronExpression = new CronExpression();

        expect(cronExpression.toString()).to.eq("* * * * *")
    });

    it("should return a human readable cron expression", () => {
        const cronExpression = new CronExpression({
            minute: 20,
            hour: 2,
            dayOfWeek: 6
        });

        expect(cronExpression.toHumanReadableString()).to.eq("At 02:20 AM, only on Saturday");
    });

    it("should return a moment", () => {
        const cronExpression = new CronExpression({
            minute: 20,
            hour: 14,
        })
    })
});
