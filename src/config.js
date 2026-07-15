// Elite Earn — core economy config
// Adjust these to match your backend's current values.

export const CONFIG = {
  POINTS_PER_DOLLAR: 1000,       // 1000 points = $1 USDT
  MAX_ADS_PER_DAY: 15,           // server-side cap (this is a client mirror — server must enforce too)
  POINTS_PER_AD: 10,             // points awarded per completed rewarded ad
  MIN_REDEEM_POINTS: 5000,       // e.g. $5 minimum payout
  ADMOB_REWARDED_UNIT_ID_ANDROID: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // replace with your real unit ID
  API_BASE_URL: 'https://api.eliteearn.app', // replace with your backend URL
};
