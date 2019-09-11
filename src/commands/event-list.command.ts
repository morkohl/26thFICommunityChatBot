import {Command} from "discord-akairo";

export class EventListCommand extends Command {

    constructor() {
        super("event-list", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "List events.",
            args: [

            ],
        });
    }
}
