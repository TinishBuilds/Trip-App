# RoamTogether mobile

The real iOS and Android version of RoamTogether, built with Expo SDK 57, React Native, Expo Router, and TypeScript.

## What works now

- English and Japanese UI with device-language detection and a manual switch
- Multi-day trips and first-class “small adventures”
- Local trip creation and persistent app state
- Group place voting and itinerary view
- Working budget totals and cheaper-picks action
- Native map tiles, markers, route line, callouts, and route fitting
- Discover feed with cheers and saved routes
- Badge collection and progress
- Shareable trip links and a PNG recap card export
- RevenueCat paywall, `ingara_pro` checks, restore, customer info, and Customer Center
- A safe server boundary for future ai& trip planning

## Run on a phone

Requirements: Node.js 22.13 or newer, npm, and Android Studio or Xcode. From this folder:

```powershell
npm install
npx expo start
```

Most of the app can be previewed in Expo Go. RevenueCat purchases require a native development build:

```powershell
npx eas-cli@latest login
npx eas-cli@latest build --profile development --platform android
```

For an installable Android APK:

```powershell
npx eas-cli@latest build --profile preview --platform android
```

Use `--platform ios` for iPhone builds. Apple requires an Apple Developer account for device/App Store distribution.

## Private local setup

Copy `.env.example` to `.env.local`. Add the RevenueCat **public SDK keys** there. Do not commit `.env.local`.

RevenueCat dashboard setup:

1. Create entitlement `ingara_pro`.
2. Create products with identifiers `monthly`, `yearly`, and `lifetime` in App Store Connect / Google Play.
3. Import those products into RevenueCat and attach them to `ingara_pro`.
4. Create a `default` offering and add monthly, annual, and lifetime packages.
5. Build and publish a RevenueCat Paywall for the default offering.
6. Configure Customer Center before showing it to paying customers.

The ai& key must never be placed in this app. Put a rotated provider key on a backend, implement `POST /v1/trip-plans`, then set only that server's base URL as `EXPO_PUBLIC_API_BASE_URL`.

## Checks

```powershell
npm run typecheck
npm run doctor
```

## Before store submission

- Approve or replace the generated RoamTogether icon and splash artwork with final brand assets.
- Set the final iOS bundle identifier and Android package if the current identifiers are not yours.
- Add privacy policy, terms, support URL, screenshots, and store descriptions.
- Test purchases with App Store Sandbox and Google Play closed testing.
- Replace the placeholder `roamtogether.app` share domain with an owned domain and configure universal/app links.
