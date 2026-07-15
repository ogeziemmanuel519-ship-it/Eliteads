import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { adMobService } from '../services/adMobService';
import { reportAdCompleted } from '../services/api';
import { usePoints } from '../context/PointsContext';
import { CONFIG } from '../config';

export default function HomeScreen({ authToken }) {
  const { points, adsWatchedToday, refreshStatus, loading } = usePoints();
  const [adReady, setAdReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    refreshStatus();
    const cleanup = adMobService.load(() => setAdReady(true));
    return cleanup;
  }, []);

  const remainingAds = Math.max(0, CONFIG.MAX_ADS_PER_DAY - adsWatchedToday);
  const capReached = remainingAds === 0;

  const handleWatchAd = () => {
    if (capReached) {
      Alert.alert('Daily limit reached', "You've hit today's ad cap. Come back tomorrow!");
      return;
    }

    adMobService.show({
      onNotReady: () => Alert.alert('Ad not ready', 'Please try again in a moment.'),
      onEarned: async (reward) => {
        setSubmitting(true);
        try {
          await reportAdCompleted(authToken, {
            adNetwork: 'admob',
            adUnitId: CONFIG.ADMOB_REWARDED_UNIT_ID_ANDROID,
          });
          await refreshStatus(); // pull the authoritative new balance from server
        } catch (err) {
          Alert.alert('Sync failed', 'Ad watched but points sync failed. Contact support if this persists.');
        } finally {
          setSubmitting(false);
        }
      },
      onClosed: () => {
        setAdReady(false);
        adMobService.load(() => setAdReady(true)); // preload next ad
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.balanceLabel}>Your balance</Text>
      <Text style={styles.balance}>{points} pts</Text>
      <Text style={styles.usdEquivalent}>
        ≈ ${(points / CONFIG.POINTS_PER_DOLLAR).toFixed(2)} USDT
      </Text>

      <Text style={styles.adsRemaining}>
        {remainingAds} of {CONFIG.MAX_ADS_PER_DAY} ads remaining today
      </Text>

      <TouchableOpacity
        style={[styles.watchButton, (capReached || !adReady || submitting) && styles.buttonDisabled]}
        onPress={handleWatchAd}
        disabled={capReached || !adReady || submitting}
      >
        {submitting || loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {capReached ? 'Daily limit reached' : adReady ? 'Watch Ad — Earn Points' : 'Loading ad...'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#0F1115' },
  balanceLabel: { color: '#8A8F98', fontSize: 14 },
  balance: { color: '#fff', fontSize: 48, fontWeight: '700', marginTop: 4 },
  usdEquivalent: { color: '#4ADE80', fontSize: 16, marginTop: 4, marginBottom: 24 },
  adsRemaining: { color: '#8A8F98', fontSize: 13, marginBottom: 20 },
  watchButton: { backgroundColor: '#5B5FEF', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, width: '100%', alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#3A3D45' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
