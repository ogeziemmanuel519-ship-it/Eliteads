import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { fetchHistory } from '../services/api';

export default function HistoryScreen({ authToken }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchHistory(authToken);
      setItems(data);
    } catch (err) {
      console.warn('Failed to load history:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authToken]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
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
      <Text style={styles.header}>Activity</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#5B5FEF" />}
        ListEmptyComponent={<Text style={styles.empty}>No activity yet — go watch an ad!</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>
                {item.type === 'ad' ? 'Ad watched' : 'Payout requested'}
              </Text>
              <Text style={styles.rowDate}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.rowPoints, item.type === 'payout' && styles.rowPointsNegative]}>
                {item.type === 'payout' ? '-' : '+'}{item.points} pts
              </Text>
              <Text style={styles.rowStatus}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115', paddingHorizontal: 20, paddingTop: 50 },
  centered: { flex: 1, backgroundColor: '#0F1115', alignItems: 'center', justifyContent: 'center' },
  header: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 16 },
  empty: { color: '#8A8F98', textAlign: 'center', marginTop: 40 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E212A',
  },
  rowTitle: { color: '#fff', fontSize: 15, fontWeight: '500' },
  rowDate: { color: '#8A8F98', fontSize: 12, marginTop: 2 },
  rowRight: { alignItems: 'flex-end' },
  rowPoints: { color: '#4ADE80', fontSize: 15, fontWeight: '600' },
  rowPointsNegative: { color: '#F87171' },
  rowStatus: { color: '#8A8F98', fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
});
