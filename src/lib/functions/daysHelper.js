function pastDays(dateTime) {
  const duration = DateTimeInterval.fromDateTimes(dateTime, DateTime.now());
  return Math.floor(duration.length("days"));
}

function startOfDay(offset = 0) {
  return pastDays(DateTime.now().startOf("day").minus({ days: offset }));
}

function startOfWeek(offset = 0) {
  return pastDays(DateTime.now().startOf("week").minus({ weeks: offset }));
}

function startOfMonth(offset = 0) {
  return pastDays(DateTime.now().startOf("month").minus({ months: offset }));
}

function startOfQuarter(offset = 0) {
  const now = DateTime.now();
  const monthsToStartOfQuarter = (now.month - 1) % 3;
  return pastDays(
    now
      .startOf("month")
      .minus({ months: monthsToStartOfQuarter })
      .minus({ months: offset * 3 }),
  );
}

function startOfHalfyear(offset = 0) {
  const now = DateTime.now();
  const monthsToStartOfHalfyear = (now.month - 1) % 6;
  return pastDays(
    now
      .startOf("month")
      .minus({ months: monthsToStartOfHalfyear })
      .minus({ months: offset * 6 }),
  );
}

function startOfYear(offset = 0) {
  return nextDays(DateTime.now().startOf("year").plus({ years: offset }));
}
