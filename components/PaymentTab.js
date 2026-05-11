import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from './BottomTabBar';

const PaymentTab = ({ onNavigate }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="card-outline" size={80} color="#CCC" />
        <Text style={styles.title}>Payments</Text>
        <Text style={styles.subtitle}>Your transaction history and payment settings will appear here.</Text>
      </View>
      <BottomTabBar activeTab="payment-tab" onNavigate={onNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
});

export default PaymentTab;
