export function getSecondsDifference(timestamp1: string, timestamp2: string): number {
  const dateTimestamp1 = new Date(timestamp1).getTime()
  const dateTimestamp2 = new Date(timestamp2).getTime()
  const timeDifference = (dateTimestamp1 - dateTimestamp2) / 1000;
  if (Number.isNaN(timeDifference)) return - 1;
  return Math.abs(timeDifference)
};

export function getDaysAgo(datetime: number): number{
  const currentDate = new Date();
  const paramDate = new Date(datetime);
  const differenceInTime = currentDate.getTime() - paramDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  console.log({
    currentDate,
    paramDate,
    differenceInTime,
    differenceInDays,
    return: Math.floor(differenceInDays)
  });
  
  return Math.floor(differenceInDays)
}