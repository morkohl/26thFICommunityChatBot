import chai from "chai";

const expect = chai.expect;

import CommunityBot from "../src/communityBot";
import {LogLevel} from "@yamdbf/core";
import configure from "../src/config/config";
import {Database} from "../src/model/database";

describe("Smoke Test", () => {

    describe("Configuration", () => {
        it("should load a default configuration", () => {
            expect(configure).to.not.throw();
        });
    });

    describe("CommunityBot", () => {
        it("should execute", () => {
            const bot = new CommunityBot({
                logLevel: LogLevel.DEBUG,
                token: "",
            });
        });
    });

    describe("Database", () => {
        it("should connect using the default configuration", () => {
            const config = configure();

            const db: Database = new Database(config.databaseConfig);

            db.init().then().catch((e) => { throw e; });
        });
    });
});
