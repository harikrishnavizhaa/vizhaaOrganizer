import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
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
        <View style={styles.card}>
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
            <Text style={styles.btnText}>{loading ? 'Saving...' : 'Next: Business Type'}</Text>
          </TouchableOpacity>
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
  },
  card: {
    backgroundColor: '#EBEBEB',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Outfit_700Bold',
    color: '#111',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#888',
    marginBottom: 22,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Outfit_700Bold',
    color: '#AAA',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: '#555',
    marginBottom: 5,
  },
  fieldInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 46,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#222',
  },
  fieldInputMulti: {
    height: 80,
    paddingTop: 12,
  },
  btn: {
    backgroundColor: '#111',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  btnDim: {
    backgroundColor: '#555',
  },
  btnText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
  },
});

export default CompleteProfile;
