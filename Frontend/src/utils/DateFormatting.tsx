import "../App.css";

const isToday = (inputDate: Date) => {

    const currentDate = new Date();

    return inputDate.getFullYear() === currentDate.getFullYear()
        && inputDate.getMonth() === currentDate.getMonth()
        && inputDate.getDate() === currentDate.getDate();
}

export const OneDayFormatWithTodayCheck = (inputDate: Date) => {
    return (isToday(inputDate) ? `Ma - ${FormatPart(inputDate.getHours(), 2, '0')}:${FormatPart(inputDate.getMinutes(), 2, '0')}`
        : `${inputDate.getFullYear()}.${FormatPart(inputDate.getMonth() + 1, 2, '0')}.${FormatPart(inputDate.getDate(), 2, '0')}`)
}

export const FormatPart = (input, toCharLength, fillupChar) => {

    var charDifference = toCharLength - input.toString().length;
    var bonus = "";

    for (let x = 0; x < charDifference; x++)
        bonus += fillupChar;

    return bonus + input + "";

}

export const AreDaysSame = (dateA: Date, dateB: Date) => {
    return (dateA.getFullYear() === dateB.getFullYear()
        && dateA.getMonth() === dateB.getMonth()
        && dateA.getDate() === dateB.getDate()) || dateB.getFullYear() === 1970;
}

const FormatWithCurrentDate = (date: Date, needDay: boolean, currentDate: Date, needHour: boolean) => {
    const isToday = AreDaysSame(date, currentDate)

    if (isToday)
        if (needHour)
            return `${needDay ? 'Ma >' : ''} ${FormatPart(date.getHours(), 2, '0')}:${FormatPart(date.getMinutes(), 2, '0')}`
        else
            return `${needDay ? 'Ma' : ''}`
    else
        if (!needDay)
            return `${FormatPart(date.getHours(), 2, '0')}:${FormatPart(date.getMinutes(), 2, '0')}`
        else if (!needHour)
            return `${date.getFullYear()}.${FormatPart(date.getMonth() + 1, 2, '0')}.${FormatPart(date.getDate(), 2, '0')}`
        else
            return `${date.getFullYear()}.${FormatPart(date.getMonth() + 1, 2, '0')}.${FormatPart(date.getDate(), 2, '0')} 
            > ${FormatPart(date.getHours(), 2, '0')}:${FormatPart(date.getMinutes(), 2, '0')}`
}

export const FormatForCard = (start: Date, end: Date, currentDate: Date, hourNeed: boolean) => {

    // Ha a két nap azonos és ma vannak
    if (AreDaysSame(start, end) && AreDaysSame(start, currentDate))
        return FormatWithCurrentDate(start, true, currentDate, hourNeed) + (hourNeed ? (' - ' + FormatWithCurrentDate(end, false, currentDate, true)) : '')
    // Ha a két nap azonos, de nem ma vannak
    if (AreDaysSame(start, end) && !AreDaysSame(start, currentDate))
        return FormatWithCurrentDate(start, true, currentDate, hourNeed) + (hourNeed ? (' - ' + FormatWithCurrentDate(end, false, currentDate, true)) : '')
    // Ha a két nap más, de az egyik ma van
    // Ha a két nap más és egyik se ma van
    else
        return FormatWithCurrentDate(start, true, currentDate, false) + ' - ' + FormatWithCurrentDate(end, true, currentDate, false)
}