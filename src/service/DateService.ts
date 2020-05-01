import {getHoliday} from '@/lib/date';
import moment from 'moment';

class DateService {
    public getHoliday(date: Date): string {
        const currentDay = moment(date);
        const holidayData = getHoliday(parseInt(currentDay.format('Y'), 10));
        for (const item of holidayData) {
            if (!currentDay.isBefore(item.holiday[0]) && !currentDay.isAfter(item.holiday[item.holiday.length - 1])) {
                return item.name;
            }
        }
        return '';
    }
}

export default DateService;
