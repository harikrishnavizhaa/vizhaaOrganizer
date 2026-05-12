import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import BlobBackground from './BlobBackground';
import { api } from '../services/api';

const Field = ({ label, value, onChangeText, placeholder, keyboardType, multiline, autoCapitalize }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.fieldInput, multiline && styles.fieldInputMulti]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#BBB"
      keyboardType={keyboardType || 'default'}
      autoCapitalize={autoCapitalize || 'words'}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  </View>
);

const CompleteProfile = ({ onDone }) => {
  const [form, setForm] = useState({
    name: '', companyName: '', email: '', city: '', gst: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.name.trim())         { Alert.alert('Required', 'Please enter your full name'); return; }
    if (!form.companyName.trim())  { Alert.alert('Required', 'Please enter your company name'); return; }
    if (!form.email.includes('@')) { Alert.alert('Required', 'Please enter a valid email'); return; }
    if (!form.city.trim())         { Alert.alert('Required', 'Please enter your city'); return; }

    setLoading(true);
    try {
      // We don't call the API yet, we collect business type first
      onDone(form);
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <BlobBackground />
        <View style={styles.cardContainer}>
          <BlurView intensity={80} tint="light" style={styles.card}>
            <Text style={styles.title}>Complete Profile</Text>
            <Text style={styles.subtitle}>Tell us about your business to continue</Text>

            <Text style={styles.sectionLabel}>REQUIRED</Text>
            <Field label="Full Name" value={form.name} onChangeText={set('name')} placeholder="John Doe" />
            <Field label="Company Name" value={form.companyName} onChangeText={set('companyName')} placeholder="Vizhaa Events" />
            <Field
              label="Email"
              value={form.email}
              onChangeText={set('email')}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Field label="City" value={form.city} onChangeText={set('city')} placeholder="Chennai" />

            <Text style={[styles.sectionLabel, { marginTop: 18 }]}>OPTIONAL</Text>
            <Field
              label="GST Number"
              value={form.gst}
              onChangeText={set('gst')}
              placeholder="22AAAAA0000A1Z5"
              autoCapitalize="characters"
            />

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDim]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={loading ? ['#666', '#444'] : ['#1A1A1A', '#000']}
                style={styles.btnGradient}
              >
                <Text style={styles.btnText}>{loading ? 'Saving...' : 'Next: Business Type'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  cardContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  card: {
    padding: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Outfit_700Bold',
    color: '#111',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    marginBottom: 26,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Outfit_700Bold',
    color: '#AAA',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  fieldWrap: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
    color: '#444',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    height: 50,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#111',
  },
  fieldInputMulti: {
    height: 90,
    paddingTop: 14,
  },
  btn: {
    height: 54,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 24,
  },
  btnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDim: {
    opacity: 0.6,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    letterSpacing: 0.5,
  },
});

export default CompleteProfile;
