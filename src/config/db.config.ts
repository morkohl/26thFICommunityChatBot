import {DatabaseDialect} from "../types/databasedialect.type";

export interface IDatabaseConfig {
    readonly host: string | undefined;
    readonly port: number | undefined;
    readonly username: string;
    readonly password: string;
    readonly database: string;
    readonly dialect: DatabaseDialect;
}

export const defaultDatabaseConfig: IDatabaseConfig = {
    host: undefined,
    port: undefined,
    username: "root",
    password: "",
    dialect: "sqlite",
    database: "26th",
};
