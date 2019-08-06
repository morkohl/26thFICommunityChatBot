import {Column, Default, ForeignKey, HasOne, Table} from "sequelize-typescript";
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

    @Default(2)
    @Column(NUMBER)
    public numberOfNotifications: number;

    @Default("30m")
    @Column(STRING)
    public notificationInterval: string;

    @Column(STRING)
    public notificationTexts: string;

    @ForeignKey(() => Event)
    @Column(BIGINT)
    public eventId: bigint;
}
