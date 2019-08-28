import Event from "../../src/model/event.model";
import {Database} from "../../src/model/database";
import {defaultDatabaseConfig} from "../../src/config/db.config";
import {ValidationError} from "sequelize";
import * as chai from "chai";

const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe("Event Model", () => {

    before(async () => {
        const db = new Database(defaultDatabaseConfig);

        await db.connect();
    });

    after(async () => {
        await Event.truncate()
    });

    const eventValues = {
        name: "test event",
        description: "a test event",
        foreignServerSignUpChannel: "some-server",
        memberSignUpChannel: "some channel",
        region: "EU"
    };

    describe("Column Value Validation", () => {

        it("should throw a validation error if any columns are null", () => {
            return expect(Event.create()).to.be.rejectedWith(ValidationError,
                "notNull Violation: Event.description cannot be null,\n" +
                "notNull Violation: Event.name cannot be null,\n" +
                "notNull Violation: Event.foreignServerSignUpChannel cannot be null,\n" +
                "notNull Violation: Event.memberSignUpChannel cannot be null,\n" +
                "notNull Violation: Event.region cannot be null");
        });

        it("should throw a validation error if any string columns are empty", () => {
            return expect(Event.create({
                ...eventValues,
                description: "",
                name: "",
                foreignServerSignUpChannel: "",
                memberSignUpChannel: "",
                region: ""
            })).to.be.rejectedWith(ValidationError, /.*notEmpty.*/);
        });

        it("should throw a validation error if the provided region is invalid", () => {
            return expect(Event.create({
                ...eventValues,
                region: "not a valid region"
            })).to.be.rejectedWith(ValidationError, "Event.region has to be either \"NA\" or \"EU\"");
        });
    });

    describe("hooks", () => {

        it("should uppercase the region argument", () => {
            const event: Event = Event.build({
                ...eventValues,
                region: "eu"
            });

            return expect(event.validate()).to.be.fulfilled;
        })
    })
});
