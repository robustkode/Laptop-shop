export function getMonthTimestamps(monthsAgo, days = true) {
  const now = new Date();
  const targetMonth = now.getMonth() - monthsAgo;
  const targetYear = now.getFullYear();

  const nowDate = new Date(now);
  const startDate = new Date(now.getFullYear(), targetMonth, 1);
  const endMonthDate = new Date(now.getFullYear(), targetMonth + 1, 0); // 0 gives the last day of the previous month
  const endDate = nowDate < endMonthDate ? nowDate : endMonthDate;

  const daysArray = [];
  if (days) {
    for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
      const date = new Date(targetYear, targetMonth, day);
      const formattedDate = date.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
      daysArray.push(formattedDate);
    }
  }

  const startUnix = startDate.getTime();
  const endUnix = endDate.getTime();

  return {
    start: startUnix,
    end: endUnix,
    days: daysArray,
  };
}

export function convertUnixToStandardDate(unix) {
  const _ = new Date(unix);
  return _.toISOString().split("T")[0];
}
