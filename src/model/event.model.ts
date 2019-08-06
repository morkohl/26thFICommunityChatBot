import {Column, Default, ForeignKey, HasMany, HasOne, Table, Unique} from "sequelize-typescript";
import {BIGINT, BOOLEAN, STRING} from "sequelize";
import Schedule from "./schedule.model";
import Occurence from "./occurence.model";
import BaseModel from "./model.base";

@Table({ modelName: "events"})
export default class Event extends BaseModel<Event> {
    @Column(STRING)
    public description: string;

    @Unique(true)
    @Column(STRING)
    public name: string;

    @Column(STRING)
    public foreignServerSignUpChannel: string;

    @Column(STRING)
    public memberSignUpChannel: string;

    @Column(STRING)
    public region: string;

    @Default(false)
    @Column(BOOLEAN)
    public disabled: boolean;

    @ForeignKey(() => Schedule)
    @Column(BIGINT)
    public scheduleId: bigint;

    @HasOne(() => Schedule)
    public schedule: Schedule;

    @HasMany(() => Occurence)
    public occurrences: Occurence[];
}
