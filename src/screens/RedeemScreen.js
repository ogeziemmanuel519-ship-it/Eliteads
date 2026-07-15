import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { requestPayout } from '../services/api';
import { usePoints } from '../context/PointsContext';
import { CONFIG } from '../config';

export default function RedeemScreen({ authToken }) {
  const { points, refreshStatus } = usePoints();
  const [walletAddress, setWalletAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canRedeem = points >= CONFIG.MIN_REDEEM_POINTS;
  const usdValue = (points / CONFIG.POINTS_PER_DOLLAR).toFixed(2);

  const handleRedeem = async () => {
    if (!walletAddress.trim()) {
      Alert.alert('Wallet required', 'Enter your TRC20 USDT wallet address.');
      return;
    }
    if (!canRedeem) {
      Alert.alert(
        'Not enough points',
        `You need at least ${CONFIG.MIN_REDEEM_POINTS} points to redeem.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await requestPayout(authToken, {
        walletAddress: walletAddress.trim(),
        pointsAmount: points,
      });
      Alert.alert('Payout requested', `Your payout is being processed. Reference: ${result.reference || 'N/A'}`);
      await refreshStatus();
    } catch (err) {
      Alert.alert('Payout failed', err.message || 'Something went wrong. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Available balance</Text>
      <Text style={styles.balance}>{points} pts (${usdValue})</Text>

      <Text style={styles.inputLabel}>USDT (TRC20) wallet address</Text>
      <TextInput
        style={styles.input}
        value={walletAddress}
        onChangeText={setWalletAddress}
        placeholder="T..."
        placeholderTextColor="#5C606B"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.button, (!canRedeem || submitting) && styles.buttonDisabled]}
        onPress={handleRedeem}
        disabled={!canRedeem || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {canRedeem ? 'Redeem to USDT' : `Need ${CONFIG.MIN_REDEEM_POINTS}+ points`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0F1115' },
  label: { color: '#8A8F98', fontSize: 14, marginTop: 40 },
  balance: { color: '#fff', fontSize: 32, fontWeight: '700', marginTop: 4, marginBottom: 32 },
  inputLabel: { color: '#8A8F98', fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: '#1A1D24', color: '#fff', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 15, marginBottom: 24, borderWidth: 1, borderColor: '#2A2D36',
  },
  button: { backgroundColor: '#5B5FEF', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#3A3D45' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
