export interface IDiscordConfig {
    readonly defaultPrefix: string;
    readonly token: string;
    readonly owner: string;
    readonly commandsDir: string;
}

export const defaultDiscordConfig: IDiscordConfig = {
    defaultPrefix: "!",
    owner: "",
    commandsDir: "./src/commands",
    token: "",
};
