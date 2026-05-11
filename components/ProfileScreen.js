import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import BottomTabBar from './BottomTabBar';

const ProfileScreen = ({ onNavigate }) => {
  const { user } = useAuth();
  const [gender, setGender] = useState('male');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={60} color="#DDD" />
            </View>
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user?.name || 'Name'}</Text>
          <Text style={styles.profileRole}>{user?.role || 'Role'}</Text>
          
          <TouchableOpacity style={styles.editDetailsBtn}>
            <Text style={styles.editDetailsText}>Edit Details</Text>
            <Ionicons name="pencil" size={12} color="#FFB800" />
          </TouchableOpacity>
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
                defaultValue={user?.name}
                placeholderTextColor="#BBB"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput 
                style={styles.input}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#BBB"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.radioRow}>
                {['Male', 'Female', 'Other'].map(item => (
                  <TouchableOpacity 
                    key={item} 
                    style={[styles.radioItem, gender === item.toLowerCase() && styles.radioActiveItem]}
                    onPress={() => setGender(item.toLowerCase())}
                  >
                    <View style={[styles.radioOuter, gender === item.toLowerCase() && styles.radioOuterActive]}>
                      {gender === item.toLowerCase() && <View style={styles.radioInnerDot} />}
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
                defaultValue={user?.city}
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
                style={styles.input}
                placeholder="98765xxxxx"
                defaultValue={user?.mobile}
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
                defaultValue={user?.email}
                placeholderTextColor="#BBB"
              />
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>Confirm Details</Text>
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
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#000',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
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
  editDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-end',
    marginRight: 30,
  },
  editDetailsText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFB800',
    marginRight: 5,
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
