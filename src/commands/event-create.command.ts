import {Command} from "discord-akairo";

export class EventCreateCommand extends Command {

    constructor() {
        super("event-create", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "Create an event.",
            args: [
                {
                    id: "eventCreateJson",
                    match: "content",
                },
            ],
        });
    }
}
