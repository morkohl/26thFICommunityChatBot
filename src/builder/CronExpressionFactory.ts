import {Weekday} from "../types/weekday.type";

export class CronExpressionFactory {

    public static getEarlyCronExpression(eventStart: string, weekDay: Weekday) {
        const hourExpression = this.getHourOfDay(eventStart) - 3;
        const dayOfWeek = this.getDayOfWeekIndex(weekDay);

        return `0 ${hourExpression} * * ${dayOfWeek}`;
    }

    public static getCronExpression(eventStart: string, weekDay: Weekday, numberOfNoticiations: number) {
        const minuteExpression = this.getMinuteExpression(numberOfNoticiations);
        const hour = this.getHourOfDay(eventStart);
        const dayOfWeek = this.getDayOfWeekIndex(weekDay);

        return `${minuteExpression} ${hour} * * ${dayOfWeek}`;
    }

    private static getMinuteExpression(numberOfNotifications: number): string {
        if (numberOfNotifications === 1) {
            return "0";
        }
        return `0/${60 / numberOfNotifications}`;
    }

    private static getHourOfDay(eventStart: string): number {
        const hourExtractionRegex = new RegExp("\\d{1,2}");

        let cronHour = Number(hourExtractionRegex.exec(eventStart)[0]);

        if (eventStart.endsWith("pm")) {
            cronHour += 11;

            if (cronHour === 24) {
                cronHour = 0;
            }
        } else {
            cronHour -= 1;
        }

        return cronHour;
    }

    private static getDayOfWeekIndex(weekday: Weekday): number {
        const weekdays = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];

        return weekdays.indexOf(weekday) + 1;
    }
}
