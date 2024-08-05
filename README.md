
# Running the app: 

Install the dependencies with the following command:\
`npm install`

Run the app with the following command:\
`npm start`

Then, open [http://localhost:3000](http://localhost:3000) to view it in your browser.

# Project structure

## /public: 

Includes assets: index.html, our logo, and service_worker.js

## /src:

### App.js:
Defines the theme of the page (light or dark), includes the navigation bar/menu, and defines the router and all the routes within it. Opens a dialog if the server is unreachable.
### localStorage.js:
for storing the following data on the user's browser: their user token to maintain their session, and their preferences regarding dark/light mode
### register_service_worker.js:
For registering a service worker for push notifications
### /components:
Contains reusable components: a toggle switch, the navigation bar, and different dialogs

### /pages:
Contains the different "pages". This is a single page application, and the "pages" are in fact components that are rendered depending on the routes defined in the router in App.js. All these pages have links on the navigation menu.


