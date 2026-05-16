import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import BottomTabBar from './BottomTabBar';

const ProfileScreen = ({ onNavigate }) => {
  const { user, updateUser } = useAuth();
  
  const [form, setForm] = useState({
    name: '',
    role: '',
    dob: null,
    gender: 'male',
    city: '',
    email: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        role: user.role || '',
        dob: user.dob ? new Date(user.dob) : null,
        gender: (user.gender || 'male').toLowerCase(),
        city: user.city || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await api.completeProfile({
        name: form.name,
        role: form.role,
        dob: form.dob,
        gender: form.gender,
        city: form.city,
        email: form.email,
      });

      if (response.success) {
        updateUser(response.user);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().charAt(0).toUpperCase();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setForm(prev => ({ ...prev, dob: selectedDate }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{getInitials(form.name)}</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{form.name || 'Name'}</Text>
          <Text style={styles.profileRole}>{form.role || 'Role'}</Text>
        </View>

        {/* Profile Details Card */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#FFD700', '#FFB800']}
            style={styles.cardHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.cardHeaderText}>Profile Details</Text>
          </LinearGradient>
          
          <View style={styles.cardBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input}
                placeholder="e.g. John Smith"
                value={form.name}
                onChangeText={(val) => setForm(prev => ({ ...prev, name: val }))}
                placeholderTextColor="#BBB"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Role</Text>
              <TextInput 
                style={styles.input}
                placeholder="e.g. Organizer"
                value={form.role}
                onChangeText={(val) => setForm(prev => ({ ...prev, role: val }))}
                placeholderTextColor="#BBB"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity 
                style={styles.input} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.inputText, !form.dob && { color: '#BBB' }]}>
                  {form.dob ? form.dob.toLocaleDateString() : 'DD/MM/YYYY'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#888" style={styles.inputIcon} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={form.dob || new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.radioRow}>
                {['Male', 'Female', 'Other'].map(item => (
                  <TouchableOpacity 
                    key={item} 
                    style={[styles.radioItem, form.gender === item.toLowerCase() && styles.radioActiveItem]}
                    onPress={() => setForm(prev => ({ ...prev, gender: item.toLowerCase() }))}
                  >
                    <View style={[styles.radioOuter, form.gender === item.toLowerCase() && styles.radioOuterActive]}>
                      {form.gender === item.toLowerCase() && <View style={styles.radioInnerDot} />}
                    </View>
                    <Text style={styles.radioLabel}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Location</Text>
                <View style={styles.optionalTag}><Text style={styles.optionalText}>Optional</Text></View>
              </View>
              <TextInput 
                style={styles.input}
                placeholder="Enter your personal location"
                value={form.city}
                onChangeText={(val) => setForm(prev => ({ ...prev, city: val }))}
                placeholderTextColor="#BBB"
              />
            </View>
          </View>
        </View>

        {/* Contact Details Card */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#FFD700', '#FFB800']}
            style={styles.cardHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.cardHeaderText}>Contact Details</Text>
          </LinearGradient>
          
          <View style={styles.cardBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: '#F0F0F0' }]}
                value={user?.mobile}
                editable={false}
                placeholderTextColor="#BBB"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.optionalTag}><Text style={styles.optionalText}>Optional</Text></View>
              </View>
              <TextInput 
                style={styles.input}
                placeholder="name@email.com"
                value={form.email}
                onChangeText={(val) => setForm(prev => ({ ...prev, email: val }))}
                placeholderTextColor="#BBB"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity 
          style={[styles.confirmBtn, loading && { opacity: 0.7 }]} 
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.confirmBtnText}>Confirm Details</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      <BottomTabBar activeTab="profile" onNavigate={onNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 115,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFB800',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarInitial: {
    fontSize: 50,
    fontFamily: 'Outfit_700Bold',
    color: '#FFB800',
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1A1A',
    marginTop: 15,
  },
  profileRole: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#888',
    marginTop: 2,
  },
  inputText: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#333',
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: 13,
  },
  cardContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    paddingTop: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
    position: 'absolute',
    top: -15,
  },
  cardHeaderText: {
    color: '#2C1206',
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
  },
  cardBody: {
    padding: 20,
    paddingTop: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionalTag: {
    backgroundColor: '#FFE4B5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  optionalText: {
    fontSize: 10,
    color: '#CD853F',
    fontFamily: 'Outfit_600SemiBold',
  },
  input: {
    backgroundColor: '#F8F9FA',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#333',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  radioActiveItem: {
    borderColor: '#FFD700',
    borderWidth: 1.5,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BBB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  radioOuterActive: {
    borderColor: '#444',
    backgroundColor: '#444',
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#32CD32',
  },
  radioLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1A1A1A',
  },
  confirmBtn: {
    backgroundColor: '#7B3F00',
    marginHorizontal: 20,
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
});

export default ProfileScreen;
