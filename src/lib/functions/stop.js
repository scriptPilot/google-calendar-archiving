function stop() {
  // Remove all existing triggers
  deleteTrigger("start");
  deleteTrigger("startFallback");

  // Set a stop note (to stop any running script to create a new trigger)
  PropertiesService.getUserProperties().setProperty("stopNote", true);

  // Log script stop
  Logger.log(`The archiving will not run again`);
  Logger.log(`If the script is currently running, it will complete`);
}
