function start() {
  // Check onStart function
  if (typeof onStart !== "function") {
    throw new Error(
      "onStart() function is missing - please check the documentation",
    );
  }

  // Set the script invocation check to true
  onStart.calledByStartFunction = true;

  // Set default values
  setMaxExecutionTime();
  setArchivingInterval();

  // Create or update the fallback trigger based on the max execution time (fallback if script is exeeding Google Script limits)
  createTrigger("startFallback", onStart.maxExecutionTime);

  // Remove any stop note from previous stop() call
  PropertiesService.getUserProperties().deleteProperty("stopNote");

  // Wrap the archiving to catch any error and ensure the next trigger creation
  try {
    // Run the onStart function
    onStart();
  } catch (err) {
    Logger.log("An error occured during the archiving");
    Logger.log(`Message: ${err.message}`);
  }

  // Check stop note (if stop() was called during the script run)
  if (PropertiesService.getUserProperties().getProperty("stopNote") !== null) {
    Logger.log(`Archiving stopped.`);
    return;
  }

  // Create a trigger based on the archiving interval
  // or after one minute after maximum execution time was reached
  let interval = onStart.archivingInterval;
  if (PropertiesService.getUserProperties().getProperty("timeout") !== null) {
    interval = 1;
    PropertiesService.getUserProperties().deleteProperty("timeout");
  }
  createTrigger("start", onStart.archivingInterval);

  // Update the fallback trigger
  // archiving interval + 1 minute to allow fallback trigger update on the next regular script run
  createTrigger("startFallback", onStart.archivingInterval + 1);
}
