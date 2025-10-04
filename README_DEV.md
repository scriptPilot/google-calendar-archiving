# Development

This is about the development of this repository.

Feel free to open an [issue](https://github.com/scriptPilot/google-calendar-archiving/issues) for bugs, feature requests or any other question.

## Requirements

* [Node.js](https://nodejs.org/) and NPM installed
* [Command Line Apps Script Projects](https://github.com/google/clasp) installed globally

## Installation

1. Clone this repository and install all dependencies:

   ```
   git clone https://github.com/scriptPilot/google-calendar-archiving.git
   cd google-calendar-archiving
   npm install
   ```

2. Login to Google Apps Script CLI:

    ```
    clasp login
    ```
3. Create a new Google Apps Script project:

    ```
    clasp create --type standalone --rootDir src --title "Google Calendar Archiving"

4. Create a file `src/onStart.js`:

    ```js
    function onStart() {
        archive('Work', 'Work Archive')
    }
    ```

5. Create two Google Calendar `Work` and `Work Archive`.

## Workflow

1. Apply changes to the code and documentation.
2. Push the changes to the [Cloud IDE](https://script.google.com/) and open the project:

    ```
    npm run start
    ````
    
3. Test the changes in the Cloud IDE according to the documentation.
4. Build the `dist/Code.gs` file:

    ```
    npm run build
    ```

5. Update the changelog.
6. Set a new version tag in GitHub Desktop.
7. Commit and push the changes to GitHub.

## Changelog

### v1

- Initial release