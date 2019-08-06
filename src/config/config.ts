import {path} from "app-root-path";
import {config} from "dotenv";

export interface IConfig {
    databaseConfig: IDatabaseConfig;
}

export type DatabaseDialect = "postgres" | "sqlite" | "mssql" | "mysql";

export type DatabaseLoggingOption = () => void | boolean;

export interface IDatabaseConfig {
    host: string | undefined;
    port: number | undefined;
    username: string;
    password: string;
    database: string;
    dialect: DatabaseDialect;
    logging: DatabaseLoggingOption;
}

export default function configure(): IConfig {
    config({path: `${path}/.env${process.env.NODE_ENV === "PROD" ? "" : ".LOCAL"}`});

    return {
        databaseConfig: {
            host: process.env.DB_HOST || defaultConfig.databaseConfig.host,
            port: parsePort(process.env.DB_PORT) || defaultConfig.databaseConfig.port,
            username: process.env.DB_USER || defaultConfig.databaseConfig.username,
            password: process.env.DB_PASSWORD || defaultConfig.databaseConfig.password,
            dialect: (process.env.DB_DIALECT || defaultConfig.databaseConfig.dialect) as DatabaseDialect,
            database: process.env.DB_DATABASE || defaultConfig.databaseConfig.database,
            logging: (process.env.DB_LOGGING || defaultConfig.databaseConfig.logging) as DatabaseLoggingOption,
        },
    };
}

function parsePort(environmentVariable: string | undefined): number | undefined {
    return environmentVariable !== undefined ? parseInt(environmentVariable, 10) : undefined;
}

const defaultConfig: IConfig = {
    databaseConfig: {
        host: undefined,
        port: undefined,
        username: "root",
        password: "",
        dialect: "sqlite",
        database: "admin",
        logging: console.log,
    },
};
