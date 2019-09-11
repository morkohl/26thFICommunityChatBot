import {AllowNull, BelongsTo, Column, ForeignKey, Table} from "sequelize-typescript";
import {BIGINT} from "sequelize";
import BaseModel from "./model.base";
import Event from "./event.model";

@Table({
    tableName: "notificationtexts",
    indexes: [
        {
            name: "unique_text_per_event_index",
            fields: [
                "eventId",
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
    @ForeignKey(() => Event)
    @Column(BIGINT)
    public eventId: bigint;

    @BelongsTo(() => Event, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        foreignKeyConstraint: true,
    })
    public event: Event;
}
