import {Database} from "../../src/model/database";
import {defaultDatabaseConfig} from "../../src/config/db.config";
import Event from "../../src/model/event.model";
import * as chai from "chai";
import {Region} from "../../src/util/types/region.type";
import Occurrence from "../../src/model/occurrence.model";
import NotificationText from "../../src/model/notificationText.model";
import {Op, UniqueConstraintError} from "sequelize";
import {EventRepository} from "../../src/repository/event.repository";
import {IEventUpdateDto} from "../../src/command/event.dto";
import {Weekday} from "../../src/util/types/weekday.type";

const expect = chai.expect;
chai.use(require("chai-as-promised"));

describe("Event Repository", () => {
    let testee: EventRepository;
    let bddUtils: EventRepositoryBDDUtils;

    before(async () => {
        const db: Database = new Database(defaultDatabaseConfig);

        await db.connect();

        bddUtils = new EventRepositoryBDDUtils();
        testee = new EventRepository();
    });

    afterEach(async () => {
        await bddUtils.clear();
    });

    describe("Searching", () => {

        describe("Searching one", () => {

            it("should find an Event given its id", async () => {
                const expectedEvent = await bddUtils.givenOneEvent();
                const actualEvent = await testee.searchOne({
                    id: BigInt(expectedEvent.id),
                });

                bddUtils.expectEventsEqual(actualEvent, expectedEvent);
            });

            it("should find an Event given its name", async () => {
                const expectedEvent = await bddUtils.givenOneEvent();
                const actualEvent = await testee.searchOne({
                    name: expectedEvent.name,
                });

                bddUtils.expectEventsEqual(actualEvent, expectedEvent);
            });

            it("should find an Event given its eventStartHour", async () => {
                const expectedEvent = await bddUtils.givenOneEvent();
                const actualEvent = await testee.searchOne({eventStartHour: expectedEvent.eventStartHour});

                bddUtils.expectEventsEqual(actualEvent, expectedEvent);
            });

            it("should find an Event given its eventStartMinute", async () => {
                const expectedEvent = await bddUtils.givenOneEvent();
                const actualEvent = await testee.searchOne({eventStartMinute: expectedEvent.eventStartMinute});

                bddUtils.expectEventsEqual(actualEvent, expectedEvent);
            });

            it("should find an Event given its eventEndHour", async () => {
                const expectedEvent = await bddUtils.givenOneEvent();
                const actualEvent = await testee.searchOne({eventEndHour: expectedEvent.eventEndHour});

                bddUtils.expectEventsEqual(actualEvent, expectedEvent);
            });
            it("should find an Event given its eventEndMinute", async () => {
                const expectedEvent = await bddUtils.givenOneEvent();
                const actualEvent = await testee.searchOne({eventEndMinute: expectedEvent.eventEndMinute});

                bddUtils.expectEventsEqual(actualEvent, expectedEvent);
            });

            it("should find an Event given its weekday", async () => {
                const expectedEvent = await bddUtils.givenOneEvent();
                const actualEvent = await testee.searchOne({weekDay: expectedEvent.weekDay });

                bddUtils.expectEventsEqual(actualEvent, expectedEvent);
            });
        });

        describe("Searching multiple", () => {
            it("should find all events", async () => {
                const expectedEvents = await bddUtils.givenManyEvents();
                const actualEvents = await testee.search({});

                bddUtils.expectAllEventsAreValidComparedToExpectedEvents(actualEvents, expectedEvents);
            });

            it("should find all events for a region", async () => {
                const expectedEvents = await bddUtils.givenManyEventsVariableRegion();
                const actualEUEvents = await testee.search({ region: "EU" });

                bddUtils.expectAllEventsAreValidComparedToExpectedEvents(actualEUEvents, expectedEvents.filter((event) => event.region === "EU"));
            });

            it("should find all events for a weekday", async () => {
                const expectedEvents = await bddUtils.givenManyEventsVariableRegion();
                const actualEvents = await testee.search({ weekDay: "monday" });

                bddUtils.expectAllEventsAreValidComparedToExpectedEvents(actualEvents, expectedEvents);
            });

            it("should find all events that have a similar name to input given", async () => {
                const expectedEvents = await bddUtils.givenManyEvents();
                const actualEvents = await testee.search({ name: {[Op.like]: "%event%"} });

                bddUtils.expectAllEventsAreValidComparedToExpectedEvents(actualEvents, expectedEvents);
            });
        });
    });
    describe("Creating", () => {
        it("should create an event", async () => {
            const actualEvent = await testee.create(EventRepositoryBDDUtils.eventTemplate);

            bddUtils.expectEventsEqual(actualEvent, EventRepositoryBDDUtils.mockDatabaseEvent);
        });

        it("should enforce the unique constraint on the name column", async () => {
            return expect(Promise.all(
                [
                    testee.create(EventRepositoryBDDUtils.eventTemplate),
                    testee.create(EventRepositoryBDDUtils.eventTemplate),
                ])).to.eventually.be.rejectedWith(UniqueConstraintError);
        });
    });

    describe("Updating", () => {
        it("should update an event", async () => {
            const initialEvent = await bddUtils.givenOneEvent();
            const updateDao: IEventUpdateDto = {
                name: "Another event",
                description: "just another ever",
                region: "NA",
                weekDay: "tuesday",
                eventStartHour: 2,
                eventStartMinute: 0,
                eventEndHour: 3,
                eventEndMinute: 0,
                foreignServerSignUpChannel: "another channel",
                memberSignUpChannel: "another channel",
                numberOfNotifications: 3
            };

            const updatedEvent = await testee.update({
                name: initialEvent.name,
            }, updateDao);

            bddUtils.expectEventsEqual(updatedEvent, {
                ...EventRepositoryBDDUtils.eventTemplate,
                ...updateDao
            });
        });

        it("should not update an event if it cannot be found", async () => {
            const updatedEvent = await testee.update({id: BigInt(12345)}, {name: "different name"});

            expect(updatedEvent).to.eq(null);
        });

        it("should enforce the unique constraint on the name column", async () => {
            const initialEvent = await bddUtils.givenOneEvent();
            const anotherEvent = await bddUtils.givenOneEvent();

            return expect(testee.update({
                name: anotherEvent.name,
            }, {
                name: initialEvent.name,
            })).to.be.rejectedWith(UniqueConstraintError);
        });
    });

    describe("Deleting", () => {
        it("should delete an event by its id", async () => {
            const event = await bddUtils.givenOneEvent();

            return expect(testee.delete({id: BigInt(event.id)})).to.eventually.equal(1);
        });

        it("should delete an event by its name", async () => {
            const event = await bddUtils.givenOneEvent();

            return expect(testee.delete({name: event.name})).to.eventually.equal(1);
        });

        it("should delete multiple events based on their name", async () => {
            const amountCreated = 5;

            await bddUtils.givenManyEvents(amountCreated);

            return expect(testee.delete({name: {[Op.like]: "%event%"}})).to.eventually.equal(amountCreated);
        });

        it("should delete related data", async () => {
            const event = await bddUtils.givenOneEvent();

            await testee.delete({id: BigInt(event.id)});

            const occurrences = await Occurrence.findAll();
            const notificationTexts = await NotificationText.findAll();

            expect(occurrences).to.be.empty;
            expect(notificationTexts).to.be.empty;
        });
    });

});

export class EventRepositoryBDDUtils {
    public static readonly eventTemplate = {
        name: "Test Event",
        description: "A test event",
        foreignServerSignUpChannel: "https://discordapp.com/channels/some/1",
        memberSignUpChannel: "https://discordapp.com/channels/some/2",
        region: "EU" as Region,
        weekDay: "monday" as Weekday,
        eventStartHour: 7,
        eventStartMinute: 0,
        eventEndHour: 8,
        eventEndMinute: 0,
        numberOfNotifications: 2,
        notificationTexts: [
            {
                text: "Some notification text",
            },
        ],
    };

    public static readonly mockDatabaseEvent: any = {
        ...EventRepositoryBDDUtils.eventTemplate,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        notificationTexts: [
            ...EventRepositoryBDDUtils.eventTemplate.notificationTexts
                .map((notificationText => {
                    notificationText["createdAt"] = new Date();
                    notificationText["updatedAt"] = new Date();
                    return notificationText;
                })),

        ],
    };

    private currentNum = 0;
    private scope = [Occurrence, NotificationText];

    public async clear(): Promise<void> {
        await Event.truncate();
        this.currentNum = 0;
    }

    public async givenOneEvent(): Promise<Event> {
        const modifiedTemplate = {
            ...EventRepositoryBDDUtils.eventTemplate,
            name: `${EventRepositoryBDDUtils.eventTemplate.name} Nr. ${this.incrementor()}`,
        };

        return await Event.create(modifiedTemplate, {include: this.scope});
    }

    public async givenManyEvents(amount: number = 5): Promise<Event[]> {
        const events: Event[] = [];

        for (let i = 0; i < amount; i++) {
            events.push(await this.givenOneEvent());
        }

        return events;
    }

    public async givenManyEventsVariableRegion(amount: number = 5): Promise<Event[]> {
        const events: Event[] = [];

        for (let i = 0; i < amount; i++) {
            events.push(await Event.create({
                ...EventRepositoryBDDUtils.eventTemplate,
                name: `${EventRepositoryBDDUtils.eventTemplate} Nr. ${this.incrementor()}`,
                region: i % 2 === 0 ? "EU" : "NA",
            }, {include: this.scope}));
        }

        return events;
    }

    public expectAllEventsAreValidComparedToExpectedEvents(actualEvents: any[], expectedEvents: any[]) {
        actualEvents.sort();
        expectedEvents.sort();

        expect(actualEvents.length).to.eq(expectedEvents.length);

        for (let i = 0; i < actualEvents.length; i++) {
            this.expectEventsEqual(actualEvents[i], expectedEvents[i]);
        }
    }

    public expectEventsEqual(actualEvent: any, expectedEvent: any): void | never {
        expect(actualEvent).to.not.be.null.and.to.not.be.undefined;
        expect(expectedEvent).to.not.be.null.and.to.not.be.undefined;

        expect(Number(actualEvent.id)).to.be.at.least(0);
        expect(actualEvent.name).to.eq(expectedEvent.name);
        expect(actualEvent.description).to.eq(expectedEvent.description);
        expect(actualEvent.foreignServerSignUpChannel).to.eq(expectedEvent.foreignServerSignUpChannel);
        expect(actualEvent.memberSignUpChannel).to.eq(expectedEvent.memberSignUpChannel);
        expect(actualEvent.region).to.eq(expectedEvent.region);
        expect(actualEvent.eventStartHour).to.eq(expectedEvent.eventStartHour);
        expect(actualEvent.eventStartMinute).to.eq(expectedEvent.eventStartMinute);
        expect(actualEvent.eventEndHour).to.eq(expectedEvent.eventEndHour);
        expect(actualEvent.eventEndMinute).to.eq(expectedEvent.eventEndMinute);
        expect(actualEvent.numberOfNotifications).to.eq(expectedEvent.numberOfNotifications);
        expect(actualEvent.createdAt).to.be.an.instanceof(Date);
        expect(actualEvent.updatedAt).to.be.an.instanceof(Date);

        expect(actualEvent.notificationTexts.length).to.eq(expectedEvent.notificationTexts.length);

        for (let i = 0; i < expectedEvent.notificationTexts.length; i++) {
            expect(Number(actualEvent.notificationTexts[i].id)).to.be.at.least(0);
            expect(Number(actualEvent.notificationTexts[i].eventId)).to.be.at.least(0);
            expect(actualEvent.notificationTexts[i].text).to.eq(expectedEvent.notificationTexts[i].text);
            expect(actualEvent.notificationTexts[i].createdAt).to.be.an.instanceof(Date);
            expect(actualEvent.notificationTexts[i].updatedAt).to.be.an.instanceof(Date);
        }

        expect(actualEvent.occurrences).to.satisfy((occurrences) => occurrences === undefined || (occurrences !== null && occurrences.length === 0));
    }

    private incrementor(): number {
        return this.currentNum++;
    }
}
