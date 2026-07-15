import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePoints } from '../context/PointsContext';
import { CONFIG } from '../config';

export default function ProfileScreen({ navigation }) {
  const { points } = usePoints();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.balanceLabel}>Total points</Text>
        <Text style={styles.balance}>{points} pts</Text>
        <Text style={styles.usdEquivalent}>≈ ${(points / CONFIG.POINTS_PER_DOLLAR).toFixed(2)} USDT</Text>
      </View>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Referral')}>
        <Text style={styles.menuText}>Refer a friend</Text>
        <Text style={styles.menuArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.menuText}>Settings</Text>
        <Text style={styles.menuArrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115', paddingHorizontal: 20, paddingTop: 50 },
  header: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 20 },
  card: {
    backgroundColor: '#1A1D24', borderRadius: 14, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: '#2A2D36',
  },
  balanceLabel: { color: '#8A8F98', fontSize: 13 },
  balance: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 4 },
  usdEquivalent: { color: '#4ADE80', fontSize: 14, marginTop: 4 },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E212A',
  },
  menuText: { color: '#fff', fontSize: 16 },
  menuArrow: { color: '#5C606B', fontSize: 20 },
});
