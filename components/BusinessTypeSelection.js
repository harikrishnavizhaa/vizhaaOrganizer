import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Dimensions, SafeAreaView, ActivityIndicator, Alert, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
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
  const scales = useRef(BUSINESS_TYPES.reduce((acc, curr) => {
    acc[curr.id] = new Animated.Value(1);
    return acc;
  }, {})).current;

  const handlePress = (id) => {
    setSelected(id);
    Animated.sequence([
      Animated.timing(scales[id], { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.timing(scales[id], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleFinish = async () => {
    if (!selected) {
      Alert.alert('Selection Required', 'Please select your business type to continue.');
      return;
    }
    setLoading(true);
    try {
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
              <Animated.View key={type.id} style={{ transform: [{ scale: scales[type.id] }] }}>
                <TouchableOpacity
                  style={[styles.cardContainer, isSelected && styles.cardSelected]}
                  onPress={() => handlePress(type.id)}
                  activeOpacity={0.9}
                >
                  <BlurView intensity={isSelected ? 40 : 20} tint="light" style={styles.card}>
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
                        <Ionicons name="checkmark-circle" size={24} color="#FFB300" />
                      </View>
                    )}
                  </BlurView>
                </TouchableOpacity>
              </Animated.View>
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
    fontSize: 30,
    fontFamily: 'Outfit_700Bold',
    color: '#111',
    lineHeight: 38,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#555',
    lineHeight: 24,
  },
  grid: {
    gap: 16,
    marginBottom: 40,
  },
  cardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  cardSelected: {
    borderColor: '#FFB300',
    backgroundColor: 'rgba(255, 179, 0, 0.05)',
    shadowColor: '#FFB300',
    shadowOpacity: 0.2,
    elevation: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 179, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  iconWrapSelected: {
    backgroundColor: '#FFB300',
  },
  cardLabel: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#333',
    flex: 1,
    letterSpacing: 0.2,
  },
  cardLabelSelected: {
    color: '#111',
  },
  checkWrap: {
    position: 'absolute',
    right: 18,
    top: 18,
  },
  btn: {
    height: 58,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 'auto',
    marginBottom: 10,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 17,
    fontFamily: 'Outfit_600SemiBold',
    letterSpacing: 0.5,
  },
});


export default BusinessTypeSelection;
