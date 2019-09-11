import {Moment} from "moment";
import * as cronstrue from "cronstrue";
import moment = require("moment");

export class CronExpression {
    public readonly minute: CronExpressionType;
    public readonly hour: CronExpressionType;
    public readonly dayOfMonth: CronExpressionType;
    public readonly month: CronExpressionType;
    public readonly dayOfWeek: CronExpressionType;
    public readonly timeZone: string;

    constructor(cronOptions?: ICronOptions) {
        cronOptions = cronOptions || {};
        this.minute = this.orAny(cronOptions.minute);
        this.hour = this.orAny(cronOptions.hour);
        this.dayOfMonth = this.orAny(cronOptions.dayOfMonth);
        this.month = this.orAny(cronOptions.month);
        this.dayOfWeek = this.orAny(cronOptions.dayOfWeek);
    }

    public toString(): string {
        return `${this.minute} ${this.hour} ${this.dayOfMonth} ${this.month} ${this.dayOfWeek}`;
    }

    public toHumanReadableString(): string {
        return cronstrue.toString(this.toString());
    }

    private orAny(expr: CronExpressionType): CronExpressionType {
        return expr === undefined || expr === null ? "*" : expr;
    }
}

export interface ICronOptions {
    minute?: CronExpressionType;
    hour?: CronExpressionType;
    dayOfMonth?: CronExpressionType;
    month?: CronExpressionType;
    dayOfWeek?: CronExpressionType;
    timeZone?: string;
}

export type CronExpressionType = number | string | "*";
