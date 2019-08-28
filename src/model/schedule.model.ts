import {
    BeforeCreate,
    BeforeUpdate,
    BelongsTo,
    Column,
    Default,
    ForeignKey,
    HasMany,
    NotEmpty,
    Table,
    AllowNull,
    IsIn,
    Is,
    BeforeValidate,
    BeforeBulkUpdate,
    BeforeBulkCreate,
    Max,
    Min,
    IsInt,
} from "sequelize-typescript";
import {BIGINT, STRING} from "sequelize";
import Event from "./event.model";
import BaseModel from "./model.base";
import NotificationText from "./notificationText.model";
import {Weekday, weekdays} from "../types/weekday.type";
import {CronExpressionFactory} from "../builder/CronExpressionFactory";

const TIME_REGEX = /^([1-9]|[0-1][1-2])(:(0[1-9]|[1-5][0-9]))?(am|pm)$/;

@Table({tableName: "schedules"})
export default class Schedule extends BaseModel<Schedule> {

    @BeforeCreate
    @BeforeUpdate
    public static setCronExpressions(instance: Schedule) {
        instance.cronSchedule = CronExpressionFactory.getCronExpression(instance.eventStart, instance.weekDay, instance.numberOfNotifications);
        instance.cronScheduleEarly = CronExpressionFactory.getEarlyCronExpression(instance.eventStart, instance.weekDay);
    }

    @BeforeBulkUpdate
    @BeforeBulkCreate
    public static processInstancesIndividually(options: any) {
        options.individualHooks = true;
    }

    @BeforeValidate
    public static lowerCaseWeekDay(instance: Schedule) {
        if(instance.weekDay) {
            instance.weekDay = instance.weekDay.toLowerCase() as Weekday;
        }
    }

    @Column
    public cronSchedule: string;

    @Column
    public cronScheduleEarly: string;

    @AllowNull(false)
    @NotEmpty
    @IsIn({
        msg: "Schedule.weekDay must be a lower-cased weekday",
        args: [weekdays],
    })
    @Column(STRING)
    public weekDay: Weekday;

    @AllowNull(false)
    @NotEmpty
    @Is({
        msg: "Schedule.eventStart must be a time expression (1-12am) or (1-12pm)",
        args: TIME_REGEX,
    })
    @Column
    public eventStart: string;

    @AllowNull(false)
    @NotEmpty
    @Is({
        msg: "Schedule.eventEnd must be a time expression (1-12am) or (1-12pm)",
        args: TIME_REGEX,
    })
    @Column
    public eventEnd: string;

    @IsInt
    @Min(1)
    @Max(5)
    @Default(2)
    @Column
    public numberOfNotifications: number;

    @HasMany(() => NotificationText)
    public notificationTexts: NotificationText[];

    @ForeignKey(() => Event)
    @AllowNull(false)
    @Column(BIGINT)
    public eventId: bigint;

    @BelongsTo(() => Event, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        foreignKeyConstraint: true,
    })
    public event: Event;
}
