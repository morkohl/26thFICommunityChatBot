import {path} from "app-root-path";
import {config} from "dotenv";

export interface Config {
    databaseConfig: DatabaseConfig;
}

export type DatabaseDialects = "pg" | "sqlite3" | string

export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    dialect: DatabaseDialects;
    storage: string;
    logging: boolean;
}

export default function configure(): Config {
    config({path: `${path}/.env${process.env.NODE_ENV === "PROD" ? "" : ".LOCAL"}`});

    return {
        databaseConfig: {
            host: process.env.DB_HOST || defaultConfig.databaseConfig.host,
            port: parsePort(process.env.DB_PORT) || defaultConfig.databaseConfig.port,
            username: process.env.DB_USER || defaultConfig.databaseConfig.username,
            password: process.env.DB_PASSWORD || defaultConfig.databaseConfig.password,
            dialect: process.env.DB_DIALECT || defaultConfig.databaseConfig.dialect,
            storage: process.env.DB_STORAGE || defaultConfig.databaseConfig.storage,
            database: process.env.DB_DATABASE || defaultConfig.databaseConfig.database,
            logging: (process.env.DB_LOGGING || defaultConfig.databaseConfig.logging) as boolean
        },
    };
}

function parsePort(environmentVariable: string | undefined): number | undefined {
    return environmentVariable !== undefined ? parseInt(environmentVariable, 10) : undefined;
}

const defaultConfig: Config = {
    databaseConfig: {
        host: "localhost",
        port: 3306,
        username: "admin",
        password: "admin",
        dialect: "sqlite3",
        storage: "",
        database: "admin",
        logging: true
    }
};
