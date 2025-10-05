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
    singleEvents: true,
  });

  // Exclude irrelevant source events
  const filteredSourceEvents = sourceEvents.filter((event) => {
    // Exclude deleted events
    if (event.status === "cancelled") return false;
    // Exclude birthdays
    if (event.eventType === "birthday") return false;
    // Exclude events which are already in the archive calendar
    if (event.organizer?.email === targetCalendar.id) return false;
    // Exclude events which are within the keep period
    const eventStartTimeZone = event.start.timeZone || targetCalendar.timeZone;
    if (event.end && event.end.dateTime) {
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
  // Archive events from the source to the target calendar
  let archivedEventsCount = 0;
  let skippedEventsCount = 0;
  for (const event of filteredSourceEvents) {
    // Check for max execution time (might be relevant on first run)
    if (
      Date.now() - archivingStarted >
      onStart.maxExecutionTime * 60 * 1000 - 15 * 1000 // some seconds buffer
    ) {
      Logger.log(
        "Maximum execution time reached. The archiving will continue on the next run.",
      );
      break;
    }
    // Create formatted date of the event for logging purpose
    const eventStartTimeZone = event.start.timeZone || sourceCalendar.timeZone;
    const eventStartDate = DateTime.fromISO(
      event.start.dateTime || event.start.date,
      { zone: eventStartTimeZone },
    );
    const formattedDate = eventStartDate.toFormat(
      event.start.dateTime ? "dd.M.yyyy HH:mm" : "dd.M.yyyy",
    );

    // Create and cleanup event copy
    const eventCopy = { ...event };
    delete eventCopy.id;
    delete eventCopy.iCalUID;
    delete eventCopy.recurringEventId;
    if (eventCopy.attendees)
      eventCopy.attendees = eventCopy.attendees.filter((a) => !a.self);

    // Create target event
    let targetEvent;
    try {
      targetEvent = Calendar.Events.insert(eventCopy, targetCalendar.id);
    } catch (err) {
      const reason = err.details?.errors?.[0]?.reason;
      if (reason === "rateLimitExceeded" || reason === "quotaExceeded") {
        Logger.log(
          `Google Calendar API rate limit reached. The archiving will continue on the next run.`,
        );
        break;
      }
      Logger.log(
        `Failed to create target event "${event.summary || "(no title)"}" from ${formattedDate}`,
      );
      skippedEventsCount++;
      continue;
    }

    // Remove source event
    try {
      Calendar.Events.remove(sourceCalendar.id, event.id);
    } catch (err) {
      if (err.details?.errors?.[0]?.reason !== "deleted") {
        Logger.log(
          `Failed to remove source event "${event.summary || "(no title)"}" from ${formattedDate}`,
        );
        try {
          Calendar.Events.remove(targetCalendar.id, targetEvent.id);
        } catch {}
        skippedEventsCount++;
        continue;
      }
    }

    // Log archiving
    archivedEventsCount++;
    Logger.log(
      `Archived event "${event.summary || "(no title)"}" from ${formattedDate}`,
    );
  }

  // Log completion
  Logger.log(
    `${archivedEventsCount} event${archivedEventsCount !== 1 ? "s" : ""} archived`,
  );
  Logger.log(
    `${skippedEventsCount} event${skippedEventsCount !== 1 ? "s" : ""} skipped`,
  );
  Logger.log("Archiving completed");
}
