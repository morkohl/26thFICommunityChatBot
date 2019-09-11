import {Command} from "discord-akairo";

export class AnnounceCommand extends Command {

    constructor() {
        super("announce", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "Create a fancy announcement.",
            args: [
                {
                    id: "announcement",
                    match: "content",
                },
            ],
        });
    }

    public async exec(message, args) {
        // send an announcement based on args.announcement
    }
}
