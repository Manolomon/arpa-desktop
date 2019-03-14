// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyB8U1sGZ0nv84GoFy68BUYg9qxIjOc7dwM",
    authDomain: "arpa-desktop.firebaseapp.com",
    databaseURL: "https://arpa-desktop.firebaseio.com",
    projectId: "arpa-desktop",
    storageBucket: "arpa-desktop.appspot.com",
    messagingSenderId: "778256506602"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
