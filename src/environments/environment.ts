// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // firebase: {
  //   projectId: 'fir-retroboard',
  //   appId: '1:815507379044:web:1ff6b29ab503fcc6f8a071',
  //   storageBucket: 'fir-retroboard.appspot.com',
  //   apiKey: 'AIzaSyBrjWR1nbjfh-N8oAGYGB55tdBobO76ZZM',
  //   authDomain: 'fir-retroboard.firebaseapp.com',
  //   messagingSenderId: '815507379044',
  // },
  firebase: {
    apiKey: "AIzaSyBrjWR1nbjfh-N8oAGYGB55tdBobO76ZZM",
    authDomain: "fir-retroboard.firebaseapp.com",
    projectId: "fir-retroboard",
    storageBucket: "fir-retroboard.appspot.com",
    messagingSenderId: "815507379044",
    appId: "1:815507379044:web:1ff6b29ab503fcc6f8a071"
  },
  production: false,

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
