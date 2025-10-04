# Google Calendar Archiving

Google Apps Script to archive Google Calendar events to another calendar.

## Installation

1. [Backup all Google Calendars](https://calendar.google.com/calendar/u/0/r/settings/export) to be able to restore them if something went wrong.
2. Open [Google Apps Script](https://script.google.com/) and create a new project `Calendar Archiving`.
3. Click at the `+` next to `Services`, add `Google Calendar API` `v3` as `Calendar`.
4. Replace the `Code.gs` file content with [this code](dist/Code.gs) and save.

## Usage

The following examples are based on assumed calendars `Work` and `Work Archive`.

### Archiving

1. Click the `+` next to `Files` to add a new script file `onStart`:

    ```js
    function onStart() {
      archive('Work', 'Work Archive')
    }
    ```

2. Select file `Code.gs`, run the function `start()` and grant the requested rights.

   Now, a nightly trigger is created to archive past events automatically.

3. To stop the archiving, select file `Code.gs` and run `stop()`.

### Multiple Calendars

Multiple source calendars can be archived to the same or different target calendars.

```js
function onStart() {
  archive('Work', 'Work Archive')
  archive('Tasks', 'Work Archive')
  archive('Family', 'Family Archive')
}
```

### Keep Events

The past days to keep events in the source calendar can be specified.

By default, the events for the last `0` day are kept.

All events which end before will be archived.

```js
archive('Work', 'Work Archive', 0)
```

There are a couple of helper function available to support the last days calculation:

```js
startOfWeek(offset = 0)       
startOfMonth(offset = 0)
startOfQuarter(offset = 0)
startOfHalfyear(offset = 0)
startOfYear(offset = 0)
```

Example - keep the events from this and last week:

```js
archive('Work', 'Work Archive', startOfWeek(1))
```

## Update

To update the script version, replace the `Code.gs` file content with [this code](dist/Code.gs).

## Deinstallation

1. To stop the archiving, select file `Code.gs` and run `stop()`.
2. Remove the Google Apps Script project.

## Support

Feel free to open an [issue](https://github.com/scriptPilot/google-calendar-archiving/issues) for bugs, feature requests or any other question.
