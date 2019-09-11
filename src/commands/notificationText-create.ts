import {Command} from "discord-akairo";

export class NotificationTextCreate extends Command {

    constructor() {
        super("notificationText-create", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "Create a Notification Text.",
            args: [

            ],
        });
    }
}
