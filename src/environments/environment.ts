// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyB280LofQv4Vs-vxCSl9CX_yL7xhkn4i0k",
    authDomain: "asdasd-c2aba.firebaseapp.com",
    databaseURL: "https://asdasd-c2aba.firebaseio.com",
    projectId: "asdasd-c2aba",
    storageBucket: "asdasd-c2aba.appspot.com",
    messagingSenderId: "716248855515"
  },
  validation: {
    passwordMinRequiredLength: 8
  }
};
