import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Contacts from 'expo-contacts';
import BlobBackground from './BlobBackground';

const ITEMS = [
  {
    title: 'SMS',
    desc: 'We sync SMS to verify your device, set up UPI as per RBI and NPCI guidelines, and ensure fraud prevention',
  },
  {
    title: 'Phone',
    desc: 'We collect phone number to match SIM on the device to your registered phone number',
  },
  {
    title: 'Location',
    desc: 'We use your location to enhance security and offer seamless banking services',
  },
];

const Permissions = ({ onAllow, onDeny }) => {
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);
    try {
      // 1. Notifications (often acts as an early prompt, though mainly for push notifications)
      // Skip if running in Expo Go since it was removed in SDK 53
      if (Constants.appOwnership !== 'expo') {
        await Notifications.requestPermissionsAsync();
      } else {
        console.warn("Skipping notification permission request in Expo Go");
      }

      // 2. Contacts (Proxy for Phone/SMS access conceptually)
      await Contacts.requestPermissionsAsync();

      // 3. Location
      await Location.requestForegroundPermissionsAsync();

    } catch (e) {
      console.warn("Permission error", e);
    } finally {
      setLoading(false);
      onAllow(); // Proceed regardless of explicit Allow/Deny since UX usually continues here
    }
  };

  return (
  <View style={styles.container}>
    <BlobBackground />
    <View style={styles.card}>
      <TouchableOpacity onPress={onDeny} style={styles.denyRow} activeOpacity={0.7}>
        <Text style={styles.denyText}>Deny</Text>
      </TouchableOpacity>

      {ITEMS.map((item, i) => (
        <View key={i} style={[styles.row, i < ITEMS.length - 1 && styles.rowBorder]}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowDesc}>{item.desc}</Text>
          </View>
          <View style={styles.checkCircle}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity 
        style={styles.allowBtn} 
        onPress={handleAllow} 
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.allowBtnText}>Allow Permissions</Text>
        )}
      </TouchableOpacity>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#EBEBEB',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },

  denyRow: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingLeft: 16,
    marginBottom: 8,
  },
  denyText: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#777',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 18,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.07)',
  },
  rowInfo: { flex: 1, paddingRight: 12 },
  rowTitle: {
    fontSize: 17,
    fontFamily: 'Outfit_700Bold',
    color: '#111',
    marginBottom: 4,
  },
  rowDesc: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    lineHeight: 18,
  },

  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Outfit_700Bold',
  },

  allowBtn: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 24,
  },
  allowBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
});

export default Permissions;
