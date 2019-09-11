import {path} from "app-root-path";
import {config} from "dotenv";
import {defaultDatabaseConfig, IDatabaseConfig} from "./db.config";
import {defaultDiscordConfig, IDiscordConfig} from "./discord.config";
import {DatabaseDialect} from "../util/types/databasedialect.type";

export interface IConfig {
    databaseConfig: IDatabaseConfig;
    discordConfig: IDiscordConfig;
}

export function configure(): IConfig {
    config({path: `${path}/.env${process.env.NODE_ENV === "PROD" ? "" : ".LOCAL"}`});

    return {
        databaseConfig: {
            host: process.env.DB_HOST || defaultConfig.databaseConfig.host,
            port: parsePort(process.env.DB_PORT) || defaultConfig.databaseConfig.port,
            username: process.env.DB_USER || defaultConfig.databaseConfig.username,
            password: process.env.DB_PASSWORD || defaultConfig.databaseConfig.password,
            dialect: (process.env.DB_DIALECT || defaultConfig.databaseConfig.dialect) as DatabaseDialect,
            database: process.env.DB_DATABASE || defaultConfig.databaseConfig.database,
        },
        discordConfig: {
            defaultPrefix: process.env.DISCORD_PREFIX || defaultConfig.discordConfig.defaultPrefix,
            commandsDir: process.env.DISCORD_COMMANDS_DIR || defaultConfig.discordConfig.commandsDir,
            owner: process.env.DISCORD_OWNER_ID || defaultConfig.discordConfig.owner,
            token: process.env.DISCORD_AUTH_TOKEN,
        },
    };
}

function parsePort(environmentVariable: string | undefined): number | undefined {
    return environmentVariable !== undefined ? parseInt(environmentVariable, 10) : undefined;
}

export const defaultConfig: IConfig = {
    databaseConfig: defaultDatabaseConfig,
    discordConfig: defaultDiscordConfig,
};
