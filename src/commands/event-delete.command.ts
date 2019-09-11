import {Command} from "discord-akairo";

export class EventDeleteCommand extends Command {

    constructor() {
        super("event-delete", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "Delete an event.",
            args: [

            ],
        });
    }
}
