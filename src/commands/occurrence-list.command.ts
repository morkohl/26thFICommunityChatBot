import {Command} from "discord-akairo";

export class OccurrenceListCommand extends Command {

    constructor() {
        super("occurrence-list", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "List occurrences for an event",
            args: [

            ],
        });
    }
}
