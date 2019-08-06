import {AutoIncrement, Column, CreatedAt, Model, PrimaryKey, UpdatedAt} from "sequelize-typescript";
import {BIGINT} from "sequelize";

export default class BaseModel<ActualModel extends Model<ActualModel>> extends Model<ActualModel> {
    @PrimaryKey
    @AutoIncrement
    @Column(BIGINT)
    public readonly id: bigint;

    @CreatedAt
    public readonly createdAt: Date;

    @UpdatedAt
    public updatedAt: Date;
}
