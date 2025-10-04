function archive(sourceCalendarName, targetCalendarName, keepPastDays = 0) {
  // Start date
  const archivingStarted = Date.now();

  // Check script invocation
  if (!onStart.calledByStartFunction) {
    throw new Error(
      "Please select the Code.gs file and run the start() script.",
    );
  }

  // Check options
  if (!sourceCalendarName) throw new Error("sourceCalendarName is missing");
  if (!targetCalendarName) throw new Error("targetCalendarName is missing");

  // Log start
  Logger.log(
    `Archiving started from "${sourceCalendarName}" to "${targetCalendarName}"`,
  );

  // Get calendar details
  const sourceCalendar = getCalendar({ calendarName: sourceCalendarName });
  const targetCalendar = getCalendar({ calendarName: targetCalendarName });

  // Calculate the max date to archive
  const dateMax = DateTime.now().startOf("day").minus({ days: keepPastDays });

  // Get all events with given max date
  let sourceEvents = getEvents({
    calendarId: sourceCalendar.id,
    dateMin: null,
    dateMax,
  });

  // Filter source events for those which end before the max date
  const filteredSourceEvents = sourceEvents.filter((event) => {
    const eventStartTimeZone = event.start.timeZone || targetCalendar.timeZone;
    if (event.recurrence) {
      const eventStart = DateTime.fromISO(
        event.start.dateTime || event.start.date,
        { zone: eventStartTimeZone },
      );
      const rrule = RRuleStr(
        `DTSTART:${eventStart.toFormat("yMMdd'T'HHmmss")}\n${event.recurrence.join("\n")}`,
      );
      return rrule.after(dateMax.toJSDate()) === null;
    } else if (event.end && event.end.dateTime) {
      eventEnd = DateTime.fromISO(event.end.dateTime, {
        zone: eventStartTimeZone,
      });
    } else if (event.end && event.end.date) {
      eventEnd = DateTime.fromISO(event.end.date, { zone: eventStartTimeZone });
    } else {
      return false;
    }
    return eventEnd <= dateMax;
  });
  // Archive (move) events from the source to the target calendar
  for (const event of filteredSourceEvents) {
    // Check for max execution time (might be relevant on first run)
    if (
      Date.now() - archivingStarted >
      onStart.maxExecutionTime * 60 * 1000 - 15 * 1000 // some seconds buffer
    ) {
      PropertiesService.getUserProperties().setProperty("timeout", true);
      Logger.log(
        "Max. execution time reached. The script will be restarted shortly.",
      );
      break;
    }
    // Move event from source to target calendar without notifying users
    Calendar.Events.move(sourceCalendar.id, event.id, targetCalendar.id, {
      sendUpdates: "none",
    });
    // Log with event date
    const eventStartTimeZone = event.start.timeZone || sourceCalendar.timeZone;
    const eventStartDate = DateTime.fromISO(
      event.start.dateTime || event.start.date,
      { zone: eventStartTimeZone },
    );
    const formattedDate = eventStartDate.toFormat(
      event.start.dateTime ? "dd.M.yyyy HH:mm" : "dd.M.yyyy",
    );
    Logger.log(
      `Archived event "${event.summary || "(no title)"}" from ${formattedDate}`,
    );
  }

  // Log completion
  Logger.log(
    `${filteredSourceEvents.length} event${filteredSourceEvents.length !== 1 ? "s" : ""} archived`,
  );
  Logger.log("Archiving completed");
}
