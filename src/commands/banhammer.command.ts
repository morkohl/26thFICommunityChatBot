import {Command} from "discord-akairo";
import {Message, GuildMember} from "discord.js";
import {BanOptions} from "discord.js";

export class BanhammerCommand extends Command {

    constructor() {
        super("banhammer", {
            category: "admin",
            clientPermissions: "ADMINISTRATOR",
            channelRestriction: "guild",
            description: "Ban a user.",
            args: [
                {
                    id: "member",
                    type: "member",
                },
                {
                    id: "days",
                    type: "number",
                    prefix: "--for-days=",
                },
                {
                    id: "reason",
                    type: "string",
                    match: "rest",
                },
            ],
        });
    }

    public async exec(message: Message, args: any) {
        const member: GuildMember = args.member;

        const banOptions: BanOptions = {
            reason: args.reason,
            days: args.days,
        };

        try {
            await member.ban(banOptions);
        } catch (err) {
            await message.reply(`Could not ban member ${member.user.username}`);
        }
    }
}
