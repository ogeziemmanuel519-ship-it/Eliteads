// Requires: npm install react-native-google-mobile-ads
// Then follow the library's native setup (Android: AndroidManifest.xml App ID entry).

import { RewardedAd, RewardedAdEventType, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { CONFIG } from '../config';

const unitId = __DEV__ ? TestIds.REWARDED : CONFIG.ADMOB_REWARDED_UNIT_ID_ANDROID;

class AdMobService {
  constructor() {
    this.rewarded = null;
    this.isLoaded = false;
  }

  load(onLoaded) {
    this.rewarded = RewardedAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    const unsubscribeLoaded = this.rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      this.isLoaded = true;
      onLoaded && onLoaded();
    });

    const unsubscribeError = this.rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      this.isLoaded = false;
      console.warn('Rewarded ad failed to load:', error);
    });

    this.rewarded.load();

    // Return cleanup so screens can unsubscribe on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeError();
    };
  }

  // Shows the ad if ready. onEarned fires only when the user watches to completion —
  // this is your signal to call reportAdCompleted() against the backend.
  show({ onEarned, onClosed, onNotReady }) {
    if (!this.isLoaded || !this.rewarded) {
      onNotReady && onNotReady();
      return;
    }

    const unsubscribeEarned = this.rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        onEarned && onEarned(reward);
      }
    );

    const unsubscribeClosed = this.rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      this.isLoaded = false;
      unsubscribeEarned();
      unsubscribeClosed();
      onClosed && onClosed();
    });

    this.rewarded.show();
  }
}

// Singleton — one instance shared across the app
export const adMobService = new AdMobService();
