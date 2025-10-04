function setArchivingInterval(minutes = 1) {
  // Check script invocation
  if (!onStart.calledByStartFunction) {
    throw new Error(
      "Please select the Code.gs file and run the start() script.",
    );
  }
  // Set the new archiving interval
  onStart.archivingInterval = minutes;
}
