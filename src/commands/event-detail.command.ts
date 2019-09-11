import {Command} from "discord-akairo";

export class EventDetailCommand extends Command {

    constructor() {
        super("event-detail", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "Get a detailed view of an event.",
            args: [
            ],
        });
    }
}
