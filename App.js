// Requires:
// npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
// npm install react-native-screens react-native-safe-area-context
// npm install react-native-google-mobile-ads
// (then npx pod-install if you add iOS later)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PointsProvider } from './src/context/PointsContext';
import HomeScreen from './src/screens/HomeScreen';
import RedeemScreen from './src/screens/RedeemScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ReferralScreen from './src/screens/ReferralScreen';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

// TODO: wire this up to your real auth flow (Firebase auth per your existing setup)
const AUTH_TOKEN = 'REPLACE_WITH_REAL_USER_TOKEN';

// Profile tab is a stack so Settings and Referral push on top of it
// instead of needing their own bottom tabs.
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0F1115' }, headerTintColor: '#fff' }}>
      <ProfileStack.Screen name="ProfileHome" options={{ title: 'Profile', headerShown: false }}>
        {(props) => <ProfileScreen {...props} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen name="Settings" options={{ title: 'Settings' }}>
        {(props) => <SettingsScreen {...props} authToken={AUTH_TOKEN} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen name="Referral" options={{ title: 'Refer a friend' }}>
        {(props) => <ReferralScreen {...props} authToken={AUTH_TOKEN} />}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
}

export default function App() {
  return (
    <PointsProvider authToken={AUTH_TOKEN}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: '#0F1115', borderTopColor: '#1E212A' },
            tabBarActiveTintColor: '#5B5FEF',
            tabBarInactiveTintColor: '#8A8F98',
          }}
        >
          <Tab.Screen name="Earn">
            {() => <HomeScreen authToken={AUTH_TOKEN} />}
          </Tab.Screen>
          <Tab.Screen name="History">
            {() => <HistoryScreen authToken={AUTH_TOKEN} />}
          </Tab.Screen>
          <Tab.Screen name="Redeem">
            {() => <RedeemScreen authToken={AUTH_TOKEN} />}
          </Tab.Screen>
          <Tab.Screen name="Profile" component={ProfileStackNavigator} />
        </Tab.Navigator>
      </NavigationContainer>
    </PointsProvider>
  );
}
