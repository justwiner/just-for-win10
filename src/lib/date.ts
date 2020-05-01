import moment, {
    Moment,
} from 'moment';

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

export {
    getWeek,
};
