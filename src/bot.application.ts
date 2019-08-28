import {configure} from "./config/config";
import {Container} from "typedi";
import {AkairoClient} from "discord-akairo";
import {Database} from "./model/database";

export class BotApplication {

    public static create(): BotApplication {
        const config = configure();
        const client = new AkairoClient({
            commandDirectory: config.discordConfig.commandsDir,
            prefix: config.discordConfig.defaultPrefix,
            ownerID: config.discordConfig.owner,
        }, { });
        const db = new Database(config.databaseConfig);

        Container.set({ id: "config", value: config});
        Container.set({ id: "bot", value: client});
        Container.set({ id: "database", value: db});

        const app = new BotApplication(client, db, config.discordConfig.token);

        return app;
    }

    constructor(private client: AkairoClient,
                private database: Database,
                private authToken: string) {
    }

    public async start(): Promise<void> {
        try {
            await this.database.connect();
            await this.client.login(this.authToken);
        } catch (e) {
            console.error("Failed to start application", e);
        }
        return Promise.resolve();
    }
}

BotApplication.create().start().then().catch(console.error);
