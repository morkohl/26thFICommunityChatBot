import {Database} from "../../src/model/database";
import {defaultDatabaseConfig} from "../../src/config/db.config";
import {ValidationError} from "sequelize";
import * as chai from "chai";
import Occurrence from "../../src/model/occurrence.model";

const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe("Occurrence Model Test", () => {

    before(async () => {
        const db = new Database(defaultDatabaseConfig);

        await db.connect();
    });

    after(async () => {
        await Occurrence.truncate()
    });

    describe("Column Value Validation", () => {
        it("should throw a validation error if any columns are null", () => {
            return expect(Occurrence.create()).to.be.rejectedWith(ValidationError,
                "notNull Violation: Occurrence.eventId cannot be null");
        });
    });
});
