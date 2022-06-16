export function getSecondsDifference(timestamp1: string, timestamp2: string): number {
  const dateTimestamp1 = new Date(timestamp1).getTime()
  const dateTimestamp2 = new Date(timestamp2).getTime()
  const timeDifference = (dateTimestamp1 - dateTimestamp2) / 1000;
  if (Number.isNaN(timeDifference)) return - 1;
  return Math.abs(timeDifference)
};