import {Database} from "../../src/model/database";
import {defaultDatabaseConfig} from "../../src/config/db.config";
import {ValidationError} from "sequelize";
import * as chai from "chai";
import NotificationText from "../../src/model/notificationText.model";

const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe("Notification Text Model", () => {

    before(async () => {
        const db = new Database(defaultDatabaseConfig);

        await db.connect();
    });

    after(async () => {
        await NotificationText.truncate()
    });

    describe("Column Value Validation", () => {
        it("should throw a validation error if any columns are null", () => {
            return expect(NotificationText.create()).to.be.rejectedWith(ValidationError,
                "notNull Violation: NotificationText.text cannot be null,\n" +
                "notNull Violation: NotificationText.eventId cannot be null");
        });
    });
});
