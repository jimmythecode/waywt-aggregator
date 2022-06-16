function getDateObject(date: string | Date): Date{
    if(typeof date === "string") return new Date(date);
    if(date instanceof Date) return date;
    return date;
}
export function getSecondsSince(timeZero: string | Date){
    const timeZeroInSeconds = Math.floor(getDateObject(timeZero).getTime()/1000);
    const secondsNow = Math.floor(new Date().getTime()/1000);
    return secondsNow - timeZeroInSeconds;
}