import {Command} from "discord-akairo";

export class NotificationTextList extends Command {

    constructor() {
        super("notificationText-list", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "List Notification Texts for an event",
            args: [

            ],
        });
    }
}
