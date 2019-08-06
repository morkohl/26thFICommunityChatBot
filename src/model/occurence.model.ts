import {AutoIncrement, Column, PrimaryKey, Table} from "sequelize-typescript";
import {BIGINT, NUMBER} from "sequelize";
import BaseModel from "./model.base";

@Table({ modelName: "occurence" })
export default class Occurence extends BaseModel<Occurence> {
    @Column(NUMBER)
    public readonly attendance: number;
}
