import {Command} from "discord-akairo";
import {GuildMember} from "discord.js";

export class KickCommand extends Command {

    constructor() {
        super("kick", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "kicks a user",
            args: [
                {
                    id: "member",
                    type: "member",
                },
                {
                    id: "reason",
                    match: "rest",
                },
            ],
        });
    }

    public async exec(message, args) {
        const member: GuildMember = args.member;

        // log statement for kick
        member.kick(args.reason);
    }
}
