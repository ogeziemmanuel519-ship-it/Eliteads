import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { updateSettings } from '../services/api';

export default function SettingsScreen({ authToken, navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    setSaving(true);
    try {
      await updateSettings(authToken, { notificationsEnabled: value });
    } catch (err) {
      Alert.alert('Save failed', 'Could not update settings. Try again.');
      setNotificationsEnabled(!value); // revert on failure
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          // TODO: clear stored auth token / Firebase signOut() here
          Alert.alert('Logged out');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Push notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          disabled={saving}
          trackColor={{ false: '#3A3D45', true: '#5B5FEF' }}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1115', paddingHorizontal: 20, paddingTop: 50 },
  header: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 20 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E212A',
  },
  rowLabel: { color: '#fff', fontSize: 16 },
  logoutButton: { marginTop: 32, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: '#F87171', fontSize: 16, fontWeight: '600' },
});
