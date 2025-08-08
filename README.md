# arg-firebasewebsite
kkn desa kamulyan
+
+Simple webpage that displays the current rainfall value from Firebase Realtime Database.
+
+## Development
+
+1. Edit `index.html` and replace the Firebase configuration object with your project credentials.
+2. Open the page in a browser; it will display updates from `rainfall/current` when values change.
+
+## Hosting
+
+For easy deployment you can host the page using [Firebase Hosting](https://firebase.google.com/docs/hosting):
+
+1. Install the Firebase CLI: `npm install -g firebase-tools`.
+2. Log in and initialize hosting in this folder: `firebase login` then `firebase init hosting`.
+3. Deploy the site with `firebase deploy`.
