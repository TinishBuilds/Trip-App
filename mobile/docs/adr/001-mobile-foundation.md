# ADR 001: Mobile foundation

**Status:** Accepted  
**Date:** 2026-09-04  
**Owners:** RoamTogether product and engineering

## Context

RoamTogether started as a static browser prototype. The product now needs a genuine iOS and Android experience with English and Japanese support, native maps, social trip sharing, small-adventure tracking, and optional paid features. It also needs a safe path to AI planning without shipping a provider secret inside the app.

The first release should be simple enough to build immediately while leaving clear seams for authentication and a shared cloud backend.

## Decision

Use Expo SDK 57, React Native, TypeScript, and Expo Router in `mobile/`.

- Keep the original static prototype at the repository root during the migration.
- Model small adventures and multi-day trips with one `Trip` type plus a `kind` discriminator.
- Persist prototype state on-device with AsyncStorage behind a context store.
- Use native `react-native-maps` tiles, markers, and polylines.
- Use device locale detection with an in-app English/Japanese override.
- Generate a native-shareable PNG recap card and a public-link placeholder.
- Isolate RevenueCat behind a provider; entitlement `ingara_pro` is the only feature-access source of truth.
- Send AI planning requests only to an app-owned server. The ai& secret remains server-side.

## Alternatives considered

### Continue the static web app

Fastest for demos but cannot provide the native sharing, map, purchase, store distribution, and mobile interaction quality the product needs.

### Fully native Swift and Kotlin apps

Best platform-specific control, but duplicates work and slows a small team shipping both platforms.

### Add a cloud backend immediately

Necessary for real accounts and collaboration, but it would make today's usable product dependent on unresolved hosting and identity choices. The current store and service boundaries are designed to be replaced with a backend repository later.

## Consequences

### Positive

- One codebase ships to iOS and Android.
- Development builds support RevenueCat and other native modules.
- Expo Router makes shared links and future deep links straightforward.
- Local-first interactions remain usable during early testing.

### Negative

- Cross-device collaboration is simulated until authentication and a backend are added.
- Public trip URLs remain placeholders until a domain and link service exist.
- Store purchases must be tested in signed native builds, not Expo Go.

## Security and privacy

- No AI provider secret or private credential is committed or placed in an `EXPO_PUBLIC_*` variable.
- RevenueCat mobile SDK keys are public identifiers but are still supplied through ignored local environment files.
- The map does not request device location in the initial release.
- A future backend must authenticate every write, validate payloads, rate-limit AI endpoints, and redact sensitive values from logs.

## Reliability and observability

- App state survives restarts through AsyncStorage.
- RevenueCat failures are caught and shown without preventing the rest of the app from loading.
- The AI adapter reports non-success server responses as actionable errors.
- Before beta, add crash reporting, structured backend logs, purchase webhook monitoring, and funnel analytics for create → complete → share.

## Rollout and rollback

1. Use internal Android APK and iOS development builds for device testing.
2. Test Japanese layouts and purchase sandbox flows.
3. Run closed beta before store production release.
4. Roll back by distributing the previous EAS build; local schema changes are additive and tolerate older stored records.

## Open questions

- Which authentication provider and backend database will own collaborative trip state?
- Which domain will host public trip pages and universal links?
- What final app icon, display name, privacy policy URL, and support URL should ship?
- Which Pro features will be enforced at launch versus introduced later?
