import {Table, BelongsTo, ForeignKey, Column, TableOptions, AllowNull} from "sequelize-typescript";
import {STRING, BIGINT} from "sequelize";
import BaseModel from "./model.base";
import Schedule from "./schedule.model";

@Table({
    tableName: "notificationtexts",
    indexes: [
        {
            name: "unique_text_per_event_index",
            fields: [
                "scheduleId",
                "text",
            ],
            unique: true,
        },
    ],
})
export default class NotificationText extends BaseModel<NotificationText> {
    @AllowNull(false)
    @Column
    public text: string;

    @AllowNull(false)
    @ForeignKey(() => Schedule)
    @Column(BIGINT)
    public scheduleId: bigint;

    @BelongsTo(() => Schedule, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        foreignKeyConstraint: true,
    })
    public schedule: Schedule;
}
