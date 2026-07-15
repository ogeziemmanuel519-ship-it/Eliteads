import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Share } from 'react-native';
import { fetchReferralInfo } from '../services/api';

export default function ReferralScreen({ authToken }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralInfo(authToken)
      .then(setInfo)
      .catch((err) => console.warn('Failed to load referral info:', err))
      .finally(() => setLoading(false));
  }, [authToken]);

  const handleShare = () => {
    if (!info) return;
    Share.share({
      message: `Join Elite Earn and start earning USDT by watching ads! Use my link: ${info.link}`,
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#5B5FEF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Refer a friend</Text>

      <View style={styles.card}>
        <Text style={styles.codeLabel}>Your referral code</Text>
        <Text style={styles.code}>{info?.code || '—'}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{info?.referredCount ?? 0}</Text>
          <Text style={styles.statLabel}>Friends joined</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{info?.pointsEarnedFromReferrals ?? 0}</Text>
          <Text style={styles.statLabel}>Points earned</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share invite link</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115', paddingHorizontal: 20, paddingTop: 50 },
  centered: { flex: 1, backgroundColor: '#0F1115', alignItems: 'center', justifyContent: 'center' },
  header: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 20 },
  card: {
    backgroundColor: '#1A1D24', borderRadius: 14, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#2A2D36', alignItems: 'center',
  },
  codeLabel: { color: '#8A8F98', fontSize: 13 },
  code: { color: '#fff', fontSize: 32, fontWeight: '700', marginTop: 6, letterSpacing: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: {
    flex: 1, backgroundColor: '#1A1D24', borderRadius: 14, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#2A2D36',
  },
  statValue: { color: '#4ADE80', fontSize: 22, fontWeight: '700' },
  statLabel: { color: '#8A8F98', fontSize: 12, marginTop: 4 },
  shareButton: { backgroundColor: '#5B5FEF', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  shareButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
