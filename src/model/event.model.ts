import {AllowNull, BeforeValidate, Column, Default, HasMany, Is, IsIn, IsInt, Max, Min, NotEmpty, Table, Unique} from "sequelize-typescript";
import {STRING} from "sequelize";
import Occurrence from "./occurrence.model";
import BaseModel from "./model.base";
import {Region} from "../util/types/region.type";
import {Weekday, weekdays} from "../util/types/weekday.type";
import NotificationText from "./notificationText.model";
import {Constants} from "../util/constants";
import {CronExpression} from "../scheduler/CronExpression";

@Table({tableName: "events"})
export default class Event extends BaseModel<Event> {

    @BeforeValidate
    public static upperCaseRegionAttribute(instance: Event) {
        if (instance.region) {
            instance.region = instance.region.toUpperCase() as Region;
        }
    }

    @BeforeValidate
    public static lowerCaseWeekDayAttribute(instance: Event) {
        if (instance.weekDay) {
            instance.weekDay = instance.weekDay.toLowerCase() as Weekday;
        }
    }

    @AllowNull(false)
    @Unique(true)
    @NotEmpty
    @Column
    public name: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public description: string;

    @AllowNull(false)
    @Is({
        msg: "Event.region has to be either \"NA\" or \"EU\"",
        args: Constants.Regexes.REGION_REGEX,
    })
    @NotEmpty
    @Column(STRING)
    public region: Region;

    @AllowNull(false)
    @NotEmpty
    @Column
    public foreignServerSignUpChannel: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    public memberSignUpChannel: string;

    @AllowNull(false)
    @NotEmpty
    @IsIn({
        msg: "Event.weekDay must be a lower-cased weekday",
        args: [weekdays],
    })
    @Column(STRING)
    public weekDay: Weekday;

    @AllowNull(false)
    @IsInt
    @Min(0)
    @Max(23)
    @Column
    public eventStartHour: number;

    @AllowNull(false)
    @IsInt
    @Min(0)
    @Max(59)
    @Column
    public eventStartMinute: number;

    @AllowNull(false)
    @IsInt
    @Min(0)
    @Max(23)
    @Column
    public eventEndHour: number;

    @AllowNull(false)
    @IsInt
    @Min(0)
    @Max(59)
    @Column
    public eventEndMinute: number;

    @IsInt
    @Min(1)
    @Max(5)
    @Default(2)
    @Column
    public numberOfNotifications: number;

    @Default(false)
    @Column
    public disabled: boolean;

    @HasMany(() => Occurrence)
    public occurrences: Occurrence[];

    @HasMany(() => NotificationText)
    public notificationTexts: NotificationText[];

    public cronJobExpressions(): CronExpression[] {
        const notificationExpressions = [];

        const hour = this.eventStartHour;
        const numberOfNotifications = this.numberOfNotifications;
        const minute = this.eventStartMinute;

        const rest = (hour + 1) - numberOfNotifications;
        const maxHour = Constants.Cron.Hour.max;
        const dayOfWeek = Constants.Cron.WeekDays[this.weekDay];

        if (rest < 0) {
            notificationExpressions.push(new CronExpression({
                hour: !!hour ? `0-${hour}` : hour,
                dayOfWeek,
                minute,
            }), new CronExpression({
                hour: rest === -1 ? maxHour : `${maxHour - Math.abs(rest) + 1}-${23}`,
                dayOfWeek: dayOfWeek === 6 ? 0 : dayOfWeek - 1,
                minute,
            }));
        } else {
            notificationExpressions.push(new CronExpression({
                hour: numberOfNotifications === 1 ? hour : `${rest}-${hour}`,
                dayOfWeek,
                minute,
            }));
        }

        return notificationExpressions;
    }
}
