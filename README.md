# Summa Installer App

## Installation

1. nvm
2. yarn
3. direnv ([ubuntu](https://installati.one/install-direnv-ubuntu-22-04/)|[macOS](https://formulae.brew.sh/formula/direnv))
4. Android studio
5. Android simulator
6. Xcode

### Setup project

1. Open terminal and `cd` to the project
2. Set env variables by run this command

   - Create .envrc file base on .envrc.local file.
   - Fill in ANDROID_SDK_ROOT field in file.

     - Get ANDROID_SDK_ROOT:

       1. Go to android studio
       2. Choose Tools -> SDK Manager -> copy path from "Android SDK Location"

     ex: `ANDROID_SDK_ROOT=/home/<username>/Android/Sdk`

   - Then run command below:

     `direnv allow`

3. Install node version 18

   `nvm install 18`

4. Switch to node version 18

   `nvm use 18`

5. Install packages for this project

   `yarn install`

### Build and run app for android

1. Build and install

   `yarn android`

2. Run the app

   `yarn start`

### Build and run app for iOS

1. Run these command to install necessary packages

   `cd ios`

   `pod install`

2. Hit the Run button in Xcode and get build failed.

3. Select a development team in the Signing & Capabilities editor for required packages. (Contact administrator for development account)

4. Hit the Run button in Xcode again to build, install and run app.

## Debug setup

### Debug on real device (android)

1. Follow this [topic](https://reactnative.dev/docs/running-on-device) to connect and register device.
2. After registering device, run `adb devices` to check if the device is on the list
3. Follow the above step 6 and 7 if all tool and env is ready.

### Configure android path to debug on simulator

1. Go to android studio -> Tools -> SDK Manager -> copy path from "Android SDK Location"
2. Open terminal and run these command:

   `export ANDROID_HOME={YOUR_SDK_PATH_HERE} export ANDROID_SDK_ROOT={YOUR_SDK_PATH_HERE} export PATH=$PATH:$ANDROID_SDK_ROOT/emulator export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools export PATH=~/Android/sdk/tools:$PATH export PATH=~/Android/sdk/platform-tools:$PATH`

## Build

### Build APK without debug mode

- run these commands in order:

  `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`

  `cd android && ./gradlew assembleDebug`

- Then you can get apk in app/build/outputs/apk/debug/app-debug.apk

### Release on TestFlight in Xcode

1. Choose Product -> Archive => Wait for build
2. Choose Distribute App -> App Store Connect -> Upload

## Notes:

### [patch-package](https://yarnpkg.com/package/patch-package)

Changed something in node_modules and want to keep it.

- Usages:

  `yarn patch-package <package-name>`

  It will generate a file in patches folder

Changed packages in node_modules:

- react-native-camera: Fix error of RNCamera.
- react-native-qrcode-scanner: Integrate touch to focus feature on camera.
- jest-useragent-mock: Setup userAgent for unit test

## Issues

### Fix error of RNCamera

Follow this [topic](https://github.com/facebook/react-native/issues/33557#issuecomment-1100919812) to fix the error of the RNCamera.

(This issue have been fixed, just read for more information)

### Connect to the Assembly application to call findDriver API when using the local server

1. Setup the [Platform](https://gitlab.com/c7607/summasystems/platform) project on the local
2. Following the comments in [this ticket](https://summa-systems.atlassian.net/browse/MOB-90) to setup the .env file to connect to the Assembly server
