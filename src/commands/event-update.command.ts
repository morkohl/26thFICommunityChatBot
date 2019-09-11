import {Command} from "discord-akairo";

export class EventUpdateCommand extends Command {

    constructor() {
        super("event-update", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "Update an event.",
            args: [

            ],
        });
    }
}
