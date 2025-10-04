function getTriggerMinutes(minutes) {
  // Ceil to next valid interval (1, 5, 10, 15 or 30)
  minutes =
    minutes >= 30
      ? minutes
      : minutes > 15
        ? 30
        : minutes > 10
          ? 15
          : minutes > 5
            ? 10
            : 5;
  return minutes;
}
