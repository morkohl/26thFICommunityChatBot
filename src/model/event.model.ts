import {Column, Default, HasMany, HasOne, Is, NotEmpty, Table, Unique, BeforeUpdate, AllowNull, BeforeValidate} from "sequelize-typescript";
import {BOOLEAN, STRING} from "sequelize";
import Schedule from "./schedule.model";
import Occurrence from "./occurrence.model";
import BaseModel from "./model.base";
import {Region} from "../types/region.type";

const REGION_REGEX = /(EU|NA)/;

@Table({tableName: "events"})
export default class Event extends BaseModel<Event> {

    @BeforeValidate
    public static lowerCaseRegionAttribute(instance: Event) {
        if(instance.region) {
            // @ts-ignore
            instance.region = instance.region.toUpperCase();
        }
    }

    @AllowNull(false)
    @NotEmpty
    @Column
    public description: string;

    @AllowNull(false)
    @Unique(true)
    @NotEmpty
    @Column
    public name: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public foreignServerSignUpChannel: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public memberSignUpChannel: string;

    @AllowNull(false)
    @Is({
        msg: "Event.region has to be either \"NA\" or \"EU\"",
        args: REGION_REGEX,
    })
    @NotEmpty
    @Column(STRING)
    public region: Region;

    @Default(false)
    @Column
    public disabled: boolean;

    @HasOne(() => Schedule)
    public schedule: Schedule;

    @HasMany(() => Occurrence)
    public occurrences: Occurrence[];
}
