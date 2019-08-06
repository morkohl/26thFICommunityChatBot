import {DatabaseConfig} from "../config/config";
import {Sequelize} from "sequelize-typescript";

export class Database {
    public sequelize: Sequelize;

    constructor(private databaseConfig: DatabaseConfig) {
    }

    public init(): Promise<void> {
        const sequelizeConfig = this.minifyConfig();

        this.sequelize = new Sequelize(sequelizeConfig as any);
        this.sequelize.addModels([__dirname + "/model/*.model.ts"]);
        this.sequelize.addModels([__dirname + "/model/*.model.js"]);
        return this.sequelize.connectionManager().sync();
    }

    /**
     * Performs a health check by querying the database.
     * @return Returns true, if the database could be queried.
     */
    public async healthCheck(): Promise<boolean> {
        try {
            throw new Error("Not implemented")
        } catch {
            return false;
        }

        return true;
    }

    /**
     * Closes the database connection
     */
    public async close(): Promise<void> {
        await this.sequelize.connectionManager.close();
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
