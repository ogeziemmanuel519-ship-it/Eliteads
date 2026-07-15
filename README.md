# Elite Earn — React Native Mobile (Expo / EAS Build)

## Install (on your machine — no Android Studio needed)
```
npm install -g eas-cli
cd EliteEarnMobile
npm install
```

## Before building
1. **`app.json`** → set `plugins[0][1].androidAppId` to your real **AdMob App ID**
   (find it in AdMob console → App settings — this is different from the ad *unit* ID).
2. **`src/config.js`** → set `ADMOB_REWARDED_UNIT_ID_ANDROID` (the rewarded ad unit ID)
   and `API_BASE_URL` (your backend's base URL).
3. **`App.js`** → wire `AUTH_TOKEN` to your real auth (Firebase, per your existing setup).
4. Your backend must implement 3 endpoints (see `src/services/api.js`):
   - `GET /user/status` → `{ points, adsWatchedToday }`
   - `POST /ads/completed` → credits points server-side, enforces the 15/day cap
   - `POST /payout/request` → validates balance + wallet, calls Chaingateway server-side

## Build the APK (cloud, no local Android SDK)
```
eas login          # free Expo account
eas build -p android --profile preview
```
This builds in Expo's cloud and gives you a download link for a real `.apk` —
install it directly on any Android phone to test.

For a Play Store release later, use `eas build -p android --profile production`
(produces an `.aab` instead).

## Why the server does the heavy lifting
Points and the ad cap are enforced server-side, not just in the app. The client only
reports "ad watched" and displays whatever the server confirms — this matches your
existing anti-abuse posture and keeps someone from patching the APK to fake ad views.

## Structure
```
App.js                       — bottom tabs: Earn, History, Redeem, Profile (stack)
src/
  config.js                  — economy constants (points/$, ad cap, min redeem)
  context/PointsContext.js   — global balance + ad-count state
  services/adMobService.js   — rewarded ad load/show wrapper
  services/api.js            — backend calls (status, ad completion, payout, history, referral, settings)
  screens/HomeScreen.js      — watch-ad-to-earn UI
  screens/RedeemScreen.js    — USDT redemption UI
  screens/HistoryScreen.js   — ad + payout activity feed
  screens/ProfileScreen.js   — balance summary, links to Settings/Referral
  screens/SettingsScreen.js  — notification toggle, logout
  screens/ReferralScreen.js  — referral code, stats, share link
```

Backend endpoints now needed, in addition to the 3 listed above:
- `GET /user/history` → `[{ id, type: 'ad'|'payout', points, status, createdAt }]`
- `GET /referral/info` → `{ code, link, referredCount, pointsEarnedFromReferrals }`
- `POST /user/settings` → accepts `{ notificationsEnabled }`

## Next steps to extend
- Add a login/sign-up screen wired to your Firebase setup (deliberately left out for now)
