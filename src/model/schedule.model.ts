import {AutoIncrement, Column, Default, ForeignKey, HasOne, PrimaryKey, Table} from "sequelize-typescript";
import {BIGINT, NUMBER, STRING} from "sequelize";
import Event from "./event.model";
import BaseModel from "./model.base";

@Table({ modelName: "schedules" })
export default class Schedule extends BaseModel<Schedule> {
    @Column(STRING)
    public cronSchedule: string;

    @Column(NUMBER)
    public eventStart: number;

    @Column(NUMBER)
    public eventEnd: number;

    @Column(NUMBER)
    @Default(2)
    public numberOfNotifications: number;

    @Column(STRING)
    @Default("30m")
    public notificationInterval: string;

    @Column(STRING)
    public notificationTexts: string;

    @ForeignKey(() => Event)
    @Column
    public eventId: bigint;

    @HasOne(() => Event)
    public event: Event;
}
