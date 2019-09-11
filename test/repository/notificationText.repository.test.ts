import * as chai from "chai";
import {NotificationTextRepository} from "../../src/repository/notificationText.repository";
import {Database} from "../../src/model/database";
import {defaultDatabaseConfig} from "../../src/config/db.config";
import NotificationText from "../../src/model/notificationText.model";
import Event from "../../src/model/event.model";
import {UniqueConstraintError} from "sequelize"
import {EventRepositoryBDDUtils} from "./event.repository.test";

const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe("Notification Texts Repository", () => {
    let testee: NotificationTextRepository;
    let bddUtils: NotificationTextRepositoryBDDUtils;

    before(async () => {
        const db: Database = new Database(defaultDatabaseConfig);

        await db.connect();

        bddUtils = new NotificationTextRepositoryBDDUtils();
        testee = new NotificationTextRepository();
    });

    afterEach(async () => {
        await bddUtils.clear();
    });

    describe("Searching Notification Texts", () => {
        describe("Searching one", () => {
            it("should find a notification text for a given text", async () => {
                const expectedNotificationText = await bddUtils.givenOneNotificationText();
                const actualNotificationText = await testee.searchOne({
                    text: expectedNotificationText.text,
                });

                bddUtils.expectNotificationTextIsValid(actualNotificationText, expectedNotificationText);
            });

            it("should find a notification text for given a eventId", async () => {
                const givenEvent = await bddUtils.eventRepositoryBDDUtils.givenOneEvent();

                const expectedNotificationText = givenEvent.notificationTexts[0];
                const actualNotificationText = await testee.searchOne({
                    eventId: BigInt(givenEvent.id),
                });

                bddUtils.expectNotificationTextIsValid(actualNotificationText, expectedNotificationText);
            });
        });

        describe("Searching many", () => {
            it("should find all notification texts", async () => {
                const expectedNotificationText = await bddUtils.givenManyNotificationTexts();
                const actualNotificationText = await testee.search({});

                bddUtils.expectNotificationTextsAreValid(actualNotificationText, expectedNotificationText);
            });

            it("should find all notification texts for a given schedule id", async () => {
                const givenEvent = await bddUtils.eventRepositoryBDDUtils.givenOneEvent();

                const expectedNotificationText = givenEvent.notificationTexts[0];
                const actualNotificationText = await testee.searchOne({
                    eventId: BigInt(givenEvent.id),
                });

                bddUtils.expectNotificationTextsAreValid(actualNotificationText, expectedNotificationText);

            });
        });
    });

    describe("Creating Notification Texts", () => {
        it("should create a Notification Text", async () => {
            const givenEvent = await bddUtils.eventRepositoryBDDUtils.givenOneEvent();
            const text = "Some other text";

            const createdNotificationText = await testee.create({
                text: text,
                eventId: BigInt(givenEvent.id)
            });

            bddUtils.expectNotificationTextIsValid(createdNotificationText, {
                text: text,
                scheduleId: givenEvent.id
            });
        });

        it("should enforce the unique constraint on the eventId and text columns", async () => {
            const givenEvent = await bddUtils.eventRepositoryBDDUtils.givenOneEvent();
            const values = {
                text: "Some other text",
                eventId: BigInt(givenEvent.id),
            };

            await testee.create(values);

            return expect(testee.create(values)).to.be.rejectedWith(UniqueConstraintError);
        });
    });

    describe("Deleting Notification Texts", () => {
        it("should delete a notification text based on its id", async () => {
            const givenNotificationText = await bddUtils.givenOneNotificationText();

            return expect(testee.delete({ id: BigInt(givenNotificationText.id) })).to.eventually.equal(1);
        });

        it("should delete a notification text based on its text", async () => {
            const givenNotificationText = await bddUtils.givenOneNotificationText();

            return expect(testee.delete({ text: givenNotificationText.text})).to.eventually.equal(1);
        });

        it("should delete many notification texts based on their scheduleId", async () => {
            const givenNotificationTexts = await bddUtils.givenManyNotificationTexts();

            return expect(testee.delete({ eventId: givenNotificationTexts[0].eventId})).to.eventually.equal(givenNotificationTexts.length);
        });
    });
});

class NotificationTextRepositoryBDDUtils {
    public eventRepositoryBDDUtils = new EventRepositoryBDDUtils();
    private currentNum = 0;

    public static notificationTextTemplate: any = EventRepositoryBDDUtils.eventTemplate.notificationTexts[0];

    public async clear() {
        this.currentNum = 0;
        await NotificationText.truncate();
        return Event.truncate();
    }

    public async givenOneNotificationText(): Promise<NotificationText> {
        const event: Event = await this.eventRepositoryBDDUtils.givenOneEvent();
        return event.notificationTexts[0];
    }

    public async givenManyNotificationTexts(amount: number = 5) {
        const event: Event = await this.eventRepositoryBDDUtils.givenOneEvent();
        const notificationTexts: NotificationText[] = [event.notificationTexts[0]];

        for (let i = 0; i < amount - 1; i++) {
            notificationTexts.push(await NotificationText.create({
                text: `${NotificationTextRepositoryBDDUtils.notificationTextTemplate.text} Nr. ${this.incrementor()}`,
                eventId: event.id
            }));
        }

        return notificationTexts;
    }

    public expectNotificationTextsAreValid(actualNotificationTexts: any, expectedNotificationTexts: any) {
        expect(expectedNotificationTexts.length).to.eq(actualNotificationTexts.length);

        for (let i = 0; i < actualNotificationTexts.length; i++) {
            this.expectNotificationTextIsValid(actualNotificationTexts[i], expectedNotificationTexts[i]);
        }
    }

    public expectNotificationTextIsValid(actualNotificationText: any, expectedNotificationText: any) {
        expect(Number(actualNotificationText.id)).to.be.at.least(0);
        expect(Number(actualNotificationText.eventId)).to.be.at.least(0);
        expect(actualNotificationText.text).to.eq(expectedNotificationText.text);
        expect(actualNotificationText.createdAt).to.be.an.instanceof(Date);
        expect(actualNotificationText.updatedAt).to.be.an.instanceof(Date);
    }

    private incrementor(): number {
        return this.currentNum++;
    }
}
