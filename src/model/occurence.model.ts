import {Column, ForeignKey, Table} from "sequelize-typescript";
import {BIGINT, NUMBER} from "sequelize";
import Event from "./event.model";
import BaseModel from "./model.base";

@Table({ modelName: "occurence" })
export default class Occurence extends BaseModel<Occurence> {
    @Column(NUMBER)
    public readonly attendance: number;

    @ForeignKey(() => Event)
    @Column(BIGINT)
    public readonly eventId: bigint;
}
