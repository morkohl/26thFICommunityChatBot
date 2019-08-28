import * as chai from "chai";
import {Database} from "../../src/model/database";
import {defaultDatabaseConfig} from "../../src/config/db.config";
import Event from "../../src/model/event.model";
import Occurrence from "../../src/model/occurrence.model";
import {OccurrenceRepository} from "../../src/repository/occurrence.repository";
import {EventRepositoryBDDUtils} from "./event.repository.test";

const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe("Occurrence Repository", () => {
    let testee: OccurrenceRepository;
    let bddUtils: OccurrenceRepositoryBDDUtils;

    before(async () => {
        const db: Database = new Database(defaultDatabaseConfig);

        await db.connect();

        bddUtils = new OccurrenceRepositoryBDDUtils();
        testee = new OccurrenceRepository();
    });

    afterEach(async () => {
        await bddUtils.clear();
    });

    describe("Searching Occurrences", () => {
        describe("Searching one", async () => {

            it("should find an occurrence based on its id", async () => {
                const expectedOccurrence = await bddUtils.givenOneOccurrence();
                const actualOccurrence = await testee.searchOne({id: BigInt(expectedOccurrence.id)});

                bddUtils.expectOccurrenceIsValid(actualOccurrence, expectedOccurrence);
            });

            it("should find an occurrence based on its date", async () => {
                const expectedOccurrence = await bddUtils.givenOneOccurrence();
                const actualOccurrence = await testee.searchOne({occurrenceDate: expectedOccurrence.occurrenceDate});

                bddUtils.expectOccurrenceIsValid(actualOccurrence, expectedOccurrence);

            });

            it("should find an occurrence based on its eventId", async () => {
                const expectedOccurrence = await bddUtils.givenOneOccurrence();
                const actualOccurrence = await testee.searchOne({eventId: expectedOccurrence.eventId});

                bddUtils.expectOccurrenceIsValid(actualOccurrence, expectedOccurrence);

            });
        });

        describe("Searching many", async () => {

            it("should find many occurrences based on their eventId", async () => {
                const expectedOccurrences = await bddUtils.givenManyOccurrences();
                const actualOccurrences = await testee.search({eventId: expectedOccurrences[0].eventId});

                bddUtils.expectOccurrencesAreValid(actualOccurrences, expectedOccurrences);
            });
        });
    });

    describe("Updating Occurrences", () => {

        it("should increase number of attendees for an event", async () => {
            const givenOccurrence = await bddUtils.givenOneOccurrence();

            const updatedAttendance = givenOccurrence.attendance++;

            const updatedOccurrence = await testee.update({
                id: givenOccurrence.id
            }, {
                attendance: updatedAttendance,
            });

            bddUtils.expectOccurrenceIsValid(updatedOccurrence, {
                ...givenOccurrence,
                attendance: updatedAttendance
            });
        });
    });

    describe("Creating Occurrences", () => {

        it("should create an occurrence", async () => {
            const givenEvent = await bddUtils.eventRepositoryBDDUtil.givenOneEvent();

            const createdOccurrence = await testee.create({
                eventId: BigInt(givenEvent.id),
            });

            bddUtils.expectOccurrenceIsValid(createdOccurrence, OccurrenceRepositoryBDDUtils.occurrenceTemplate);
        });

        it("should create an occurrence with a date", async () => {
            const givenEvent = await bddUtils.eventRepositoryBDDUtil.givenOneEvent();
            const occurrenceDate = new Date();

            const createdOccurrence = await testee.create({
                eventId: BigInt(givenEvent.id),
                occurrenceDate: occurrenceDate,
            });

            bddUtils.expectOccurrenceIsValid(createdOccurrence, OccurrenceRepositoryBDDUtils.occurrenceTemplate);
            expect(createdOccurrence.occurrenceDate).to.eq(occurrenceDate);
        });
    });

    describe("Deleting Notification Texts", () => {

        it("should delete an occurrence based on its id", async () => {
            const givenOccurrence = await bddUtils.givenOneOccurrence();

            return expect(testee.delete({id: BigInt(givenOccurrence.id)})).to.eventually.equal(1);
        });

        it("should delete many occurrences based on their eventId", async () => {
            const givenOccurrences = await bddUtils.givenManyOccurrences();
            const eventId = givenOccurrences[0].eventId;

            return expect(testee.delete({eventId: eventId})).to.eventually.equal(givenOccurrences.length);
        });
    });
});

class OccurrenceRepositoryBDDUtils {
    public eventRepositoryBDDUtil = new EventRepositoryBDDUtils();

    public static occurrenceTemplate = {
        attendance: 0,
        occurrenceDate: new Date(),
    };

    public async clear() {
        await Event.truncate();
        return Occurrence.truncate();
    }

    public async givenOneOccurrence(): Promise<Occurrence> {
        const event = await this.eventRepositoryBDDUtil.givenOneEvent();

        return Occurrence.create({
            eventId: event.id
        });
    }

    public async givenManyOccurrences(amount: number = 5): Promise<Occurrence[]> {
        const event = await this.eventRepositoryBDDUtil.givenOneEvent();
        const occurrences = [];

        for (let i = 0; i < amount; i++) {
            occurrences.push(await Occurrence.create({eventId: event.id}));
        }

        return occurrences;
    }

    public expectOccurrencesAreValid(actualOccurrences: Occurrence[], expectedOccurrences: any[]) {
        expect(actualOccurrences.length).to.eq(expectedOccurrences.length);

        for (let i = 0; i < actualOccurrences.length; i++) {
            this.expectOccurrenceIsValid(actualOccurrences[i], expectedOccurrences[i]);
        }
    }

    public expectOccurrenceIsValid(actualOccurrence: Occurrence, expectedOccurrence: any) {
        expect(Number(actualOccurrence.id)).to.be.at.least(0);
        expect(Number(actualOccurrence.eventId)).to.be.at.least(0);
        expect(actualOccurrence.attendance).to.equal(expectedOccurrence.attendance);
        expect(actualOccurrence.occurrenceDate).to.be.an.instanceof(Date);
        expect(actualOccurrence.createdAt).to.be.an.instanceof(Date);
        expect(actualOccurrence.updatedAt).to.be.an.instanceof(Date);
    }
}
