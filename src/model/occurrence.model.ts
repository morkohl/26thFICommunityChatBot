import {AllowNull, BelongsTo, Column, Default, ForeignKey, Table} from "sequelize-typescript";
import {BIGINT} from "sequelize";
import Event from "./event.model";
import BaseModel from "./model.base";

@Table({ tableName: "occurrences" })
export default class Occurrence extends BaseModel<Occurrence> {
    @Default(0)
    @Column
    public attendance: number;

    @Default(new Date())
    @Column
    public occurrenceDate: Date;

    @BelongsTo(() => Event, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        foreignKeyConstraint: true,
    })
    public readonly event: Event;

    @AllowNull(false)
    @ForeignKey(() => Event)
    @Column(BIGINT)
    public readonly eventId: bigint;
}
