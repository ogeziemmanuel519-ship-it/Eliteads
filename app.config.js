module.exports = {
  expo: {
    name: "Elite Earn",
    slug: "elite-earn",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    splash: { backgroundColor: "#0F1115" },
    android: {
      package: "com.eliteEarn.app",
      versionCode: 1,
    },
    plugins: [
      "./plugins/withAdMobAppId",
      [
        "expo-build-properties",
        {
          android: {
            kotlinVersion: "1.9.24",
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            buildToolsVersion: "34.0.0",
          },
        },
      ],
    ],
  },
};
