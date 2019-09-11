import {Command} from "discord-akairo";

export class NotificationTextDelete extends Command {

    constructor() {
        super("notificationText-delete", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "Delete a Notification Text.",
            args: [

            ],
        });
    }
}
