function createTrigger(functionName, minutes) {
  if (functionName === "startFallback") {
    minutes = getTriggerMinutes(minutes);
    let newTrigger = null;
    if (minutes <= 30) {
      newTrigger = ScriptApp.newTrigger(functionName)
        .timeBased()
        .everyMinutes(minutes)
        .create();
    } else {
      newTrigger = ScriptApp.newTrigger(functionName)
        .timeBased()
        .everyHours(1)
        .create();
    }
    deleteTrigger(functionName, newTrigger.getUniqueId());
  } else {
    deleteTrigger(functionName);
    ScriptApp.newTrigger(functionName)
      .timeBased()
      .after(minutes * 60 * 1000)
      .create();
  }
  Logger.log(
    `Trigger created for the ${functionName}() function ${functionName === "startFallback" ? "every" : "in"} ${minutes} minute${minutes !== 1 ? "s" : ""}`,
  );
}
