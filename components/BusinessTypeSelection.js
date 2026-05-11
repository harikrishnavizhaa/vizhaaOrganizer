import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, SafeAreaView, ActivityIndicator, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BlobBackground from './BlobBackground';

const { width } = Dimensions.get('window');

const BUSINESS_TYPES = [
  { id: 'catering', label: 'Catering Service', icon: 'restaurant-outline' },
  { id: 'wedding', label: 'Wedding Organizer', icon: 'heart-outline' },
  { id: 'event_mgmt', label: 'Event Management Company', icon: 'calendar-outline' },
  { id: 'hotel', label: 'Hotel / Banquet', icon: 'business-outline' },
  { id: 'freelancer', label: 'Freelancer Organizer', icon: 'person-outline' },
];

const BusinessTypeSelection = ({ onDone }) => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!selected) {
      Alert.alert('Selection Required', 'Please select your business type to continue.');
      return;
    }
    setLoading(true);
    try {
      // Pass the selected type back to AuthFlow
      onDone(selected);
    } catch (error) {
      Alert.alert('Error', 'Failed to save your selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BlobBackground />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>What's your business type?</Text>
          <Text style={styles.subtitle}>Select the category that best describes your services</Text>
        </View>

        <View style={styles.grid}>
          {BUSINESS_TYPES.map((type) => {
            const isSelected = selected === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelected(type.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                  <Ionicons 
                    name={type.icon} 
                    size={28} 
                    color={isSelected ? '#FFF' : '#FFB300'} 
                  />
                </View>
                <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                  {type.label}
                </Text>
                {isSelected && (
                  <View style={styles.checkWrap}>
                    <Ionicons name="checkmark-circle" size={20} color="#FFB300" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={[styles.btn, !selected && styles.btnDisabled]} 
          onPress={handleFinish}
          disabled={loading || !selected}
        >
          <LinearGradient
            colors={selected ? ['#1A1A1A', '#000'] : ['#CCC', '#BBB']}
            style={styles.btnGradient}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnText}>Complete Setup</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
    flexGrow: 1,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: '#111',
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    lineHeight: 22,
  },
  grid: {
    gap: 16,
    marginBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#FFB300',
    backgroundColor: '#FFF',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 179, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconWrapSelected: {
    backgroundColor: '#FFB300',
  },
  cardLabel: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#333',
    flex: 1,
  },
  cardLabelSelected: {
    color: '#111',
  },
  checkWrap: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  btn: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 'auto',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
  },
});

export default BusinessTypeSelection;
