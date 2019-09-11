import {defaultDatabaseConfig, IDatabaseConfig} from "../config/db.config";
import {Sequelize} from "sequelize-typescript";

export class Database {
    public sequelize: Sequelize;

    constructor(private databaseConfig: IDatabaseConfig = defaultDatabaseConfig) {
    }

    public async connect(): Promise<void> {
        const sequelizeConfig = this.minifyConfig();

        this.sequelize = new Sequelize(sequelizeConfig as any);
        this.sequelize.addModels([__dirname + "/**/*.model.ts"]);
        this.sequelize.addModels([__dirname + "/**/*.model.js"]);

        return await this.sequelize.sync();
    }

    // public async healthCheck(): Promise<boolean> {
    //     try {
    //         throw new Error("Not implemented");
    //     } catch {
    //         return false;
    //     }
    //     return true;
    // }

    public async close(): Promise<void> {
        return await this.sequelize.connectionManager.close();
    }

    private minifyConfig(): { [key: string]: any } {
        return Object.keys(this.databaseConfig).reduce((acc, currentKey) => {
            const currentVal = this.databaseConfig[currentKey];
            if (currentVal) {
                acc[currentKey] = currentVal;
            }
            return acc;
        }, {});
    }
}
