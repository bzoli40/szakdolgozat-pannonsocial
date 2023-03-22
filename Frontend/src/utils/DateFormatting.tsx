import "../App.css";

const FormatPart = (input, toCharLength, fillupChar) => {

    var charDifference = toCharLength - input.toString().length;
    var bonus = "";

    for (let x = 0; x < charDifference; x++)
        bonus += fillupChar;

    return bonus + input + "";

}

const AreDaysSame = (dateA: Date, dateB: Date) => {
    return dateA.getFullYear() === dateB.getFullYear()
        && dateA.getMonth() === dateB.getMonth()
        && dateA.getDate() === dateB.getDate();
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