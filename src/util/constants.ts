export class Constants {
    public static Regexes = {
        TIME_REGEX: /^([0-9]|[0-1][0-9]|2[0-3])(:([0-5][0-9]))?$/,
        REGION_REGEX: /^(EU|NA)$/,
        HOUR_REGEX: /^([0-9]|[0-1][0-9]|2[0-3])(?=:)*/,
        MINUTE_REGEX: /(?<=:)([0-5][0-9]|0)/,
    };

    public static Cron = {
        WeekDays: {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 0,
        },
        Hour: {
            Max: 23,
            Min: 0,
        },
        Minute: {
            Max: 59,
            Min: 0,
        },
        Any: "*",
        DefaultTimeZone: "America/Los-Angeles"
    };
}
