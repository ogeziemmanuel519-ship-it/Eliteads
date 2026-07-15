const { withAndroidManifest } = require('@expo/config-plugins');

const ADMOB_APP_ID = 'ca-app-pub-6270419797977534~6448920479';

module.exports = function withAdMobAppId(config) {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application[0];
    if (!application['meta-data']) application['meta-data'] = [];
    application['meta-data'] = application['meta-data'].filter(
      (item) => item.$['android:name'] !== 'com.google.android.gms.ads.APPLICATION_ID'
    );
    application['meta-data'].push({
      $: {
        'android:name': 'com.google.android.gms.ads.APPLICATION_ID',
        'android:value': ADMOB_APP_ID,
      },
    });
    return config;
  });
};
