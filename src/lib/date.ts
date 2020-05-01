import moment, {
    Moment,
} from 'moment';

/**
 * 获取当前是星期几
 * @param date Moment
 */
function getWeek(date: Moment): string {
    const week = date.day();
    switch (week) {
        case 1:
            return '星期一';
        case 2:
            return '星期二';
        case 3:
            return '星期三';
        case 4:
            return '星期四';
        case 5:
            return '星期五';
        case 6:
            return '星期六';
        case 0:
            return '星期日';
        default:
            return '星期一';
    }
}

/**
 * 获取节假日，以及调休信息
 * holiday - 放假, workDay - 调休
 */
interface HolidayItem {
    name: string;
    holiday: string[];
    workDay: string[];
}
interface HolidayData {
    [proppName: string]: HolidayItem[];
}
function getHoliday(year: number): HolidayItem[] {
    const holidayData: HolidayData = {
        2020: [
            {
                name: '元旦节',
                holiday: ['2020-1-1'],
                workDay: [],
            },
            {
                name: '春节',
                holiday: [
                    '2020-1-24',
                    '2020-1-25',
                    '2020-1-26',
                    '2020-1-27',
                    '2020-1-28',
                    '2020-1-29',
                    '2020-1-30',
                ],
                workDay: [],
            },
            {
                name: '清明节',
                holiday: [
                    '2020-4-4',
                    '2020-4-5',
                    '2020-4-6',
                ],
                workDay: [],
            },
            {
                name: '劳动节',
                holiday: [
                    '2020-5-1',
                    '2020-5-2',
                    '2020-5-3',
                    '2020-5-4',
                    '2020-5-5',
                ],
                workDay: [
                    '2020-4-26',
                    '2020-5-29',
                ],
            },
            {
                name: '端午节',
                holiday: [
                    '2020-6-25',
                    '2020-6-26',
                    '2020-6-27',
                ],
                workDay: [
                    '2020-6-28',
                ],
            },
            {
                name: '国庆节、中秋节',
                holiday: [
                    '2020-10-1',
                    '2020-10-2',
                    '2020-10-3',
                    '2020-10-4',
                    '2020-10-5',
                    '2020-10-6',
                    '2020-10-7',
                    '2020-10-8',
                ],
                workDay: [
                    '2020-9-27',
                    '2020-10-10',
                ],
            },
        ],
    };
    return holidayData[year];
}

export {
    getWeek,
    getHoliday,
};
