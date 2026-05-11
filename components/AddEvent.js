import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const EVENT_TYPES = [
  { id: 'wedding', label: 'Wedding', icon: 'ring' },
  { id: 'corporate', label: 'Corporate', icon: 'briefcase' },
  { id: 'birthday', label: 'Birthday', icon: 'birthday-cake' },
  { id: 'other', label: 'Other', icon: 'ellipsis-h' },
];

const DRESS_CODES = [
  { id: 'white_shirt', label: 'White Shirt', icon: 'tshirt' },
  { id: 'black_shirt', label: 'Black Shirt', icon: 'tshirt' },
  { id: 'white_tshirt', label: 'White T-Shirt', icon: 'tshirt' },
  { id: 'black_tshirt', label: 'Black T-Shirt', icon: 'tshirt' },
];

const SERVICES = [
  { id: 'breakfast', label: 'Breakfast', icon: 'coffee' },
  { id: 'lunch', label: 'Lunch', icon: 'utensils' },
  { id: 'dinner', label: 'Dinner', icon: 'moon' },
  { id: 'snacks', label: 'Snacks', icon: 'cookie' },
];

const AddEvent = ({ onBack, onProceed }) => {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');
  const [suppliers, setSuppliers] = useState('1');
  const [eventType, setEventType] = useState('wedding');
  const [dressCode, setDressCode] = useState('white_shirt');
  const [selectedServices, setSelectedServices] = useState(['breakfast', 'lunch']);

  const toggleService = (id) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Banner */}
      <View style={styles.bannerContainer}>
        <LinearGradient
          colors={['#1A1A1A', '#333']}
          style={styles.banner}
        >
          <MaterialCommunityIcons name="party-popper" size={40} color="#FFD700" style={styles.bannerIconLeft} />
          <Text style={styles.bannerTitle}>EVENT DETAILS</Text>
          <MaterialCommunityIcons name="star-face" size={40} color="#FFD700" style={styles.bannerIconRight} />
        </LinearGradient>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          {/* Event Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Name</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. Vijay's Wedding Event"
              placeholderTextColor="#BBB"
              value={eventName}
              onChangeText={setEventName}
            />
          </View>

          {/* Event Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {EVENT_TYPES.map(type => (
                <TouchableOpacity 
                  key={type.id} 
                  style={[styles.typeCard, eventType === type.id && styles.activeCard]}
                  onPress={() => setEventType(type.id)}
                >
                  <View style={[styles.typeIconContainer, eventType === type.id && styles.activeIconContainer]}>
                    <FontAwesome5 name={type.icon} size={24} color={eventType === type.id ? '#FFD700' : '#666'} />
                  </View>
                  <Text style={styles.typeLabel}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. Event Venue Address"
              placeholderTextColor="#BBB"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput 
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#BBB"
              value={date}
              onChangeText={setDate}
            />
          </View>

          {/* Times */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>In Time</Text>
              <TextInput 
                style={styles.input}
                placeholder="HH:MM AM/PM"
                placeholderTextColor="#BBB"
                value={inTime}
                onChangeText={setInTime}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Out Time</Text>
              <TextInput 
                style={styles.input}
                placeholder="HH:MM AM/PM"
                placeholderTextColor="#BBB"
                value={outTime}
                onChangeText={setOutTime}
              />
            </View>
          </View>

          {/* Suppliers */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Suppliers</Text>
            <TextInput 
              style={styles.input}
              placeholder="1"
              keyboardType="numeric"
              placeholderTextColor="#BBB"
              value={suppliers}
              onChangeText={setSuppliers}
            />
          </View>

          {/* Dress Code */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dress Code</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {DRESS_CODES.map(code => (
                <TouchableOpacity 
                  key={code.id} 
                  style={[styles.typeCard, dressCode === code.id && styles.activeCard]}
                  onPress={() => setDressCode(code.id)}
                >
                  <View style={[styles.typeIconContainer, dressCode === code.id && styles.activeIconContainer]}>
                    <FontAwesome5 name={code.icon} size={24} color={dressCode === code.id ? '#FFD700' : '#666'} />
                  </View>
                  <Text style={styles.typeLabel}>{code.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Services */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Select Services</Text>
              <View style={styles.priceTag}>
                <Text style={styles.priceTagText}>₹500 each</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {SERVICES.map(service => (
                <TouchableOpacity 
                  key={service.id} 
                  style={[styles.typeCard, selectedServices.includes(service.id) && styles.activeCard]}
                  onPress={() => toggleService(service.id)}
                >
                  <View style={[styles.typeIconContainer, selectedServices.includes(service.id) && styles.activeIconContainer]}>
                    <FontAwesome5 name={service.icon} size={24} color={selectedServices.includes(service.id) ? '#FFD700' : '#666'} />
                  </View>
                  <Text style={styles.typeLabel}>{service.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Cost Estimation Card */}
          <View style={styles.costCard}>
            <Text style={styles.costTitle}>Estimated Cost</Text>
            <Text style={styles.costDetail}>Services : {selectedServices.length} x ₹500</Text>
            <Text style={styles.costDetail}>Suppliers : 1</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.costRow}>
              <Text style={styles.totalLabel}>Total :</Text>
              <Text style={styles.totalValue}>₹{selectedServices.length * 500}</Text>
            </View>

            <View style={styles.advanceBar}>
              <Text style={styles.advanceLabel}>Advance to Pay(25%) :</Text>
              <Text style={styles.advanceValue}>₹{(selectedServices.length * 500) * 0.25}</Text>
            </View>
            <Text style={styles.balanceText}>Balance after event : ₹{(selectedServices.length * 500) * 0.75}</Text>

            <View style={styles.couponGroup}>
              <Text style={styles.couponLabel}>Coupon code</Text>
              <TextInput 
                style={styles.couponInput}
                placeholder="Enter your Vizhaa's voucher"
                placeholderTextColor="#BBB"
              />
            </View>

            <TouchableOpacity 
              style={styles.payBtn} 
              onPress={() => onProceed({
                eventName,
                location,
                date,
                inTime,
                outTime,
                suppliers,
                eventType,
                dressCode,
                selectedServices
              })}
            >
              <Text style={styles.payBtnText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav Placeholder (to match spacing) */}
      <View style={{ height: 80 }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  bannerContainer: {
    height: 140,
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  banner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontFamily: 'Outfit_700Bold',
    marginHorizontal: 15,
  },
  bannerIconLeft: { opacity: 0.6 },
  bannerIconRight: { opacity: 0.6 },
  backBtn: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formCard: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#FFF',
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  horizontalScroll: {
    marginHorizontal: -5,
  },
  typeCard: {
    width: 90,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  activeCard: {
    borderColor: '#FFD700',
  },
  typeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeIconContainer: {
    backgroundColor: '#2C1206',
  },
  typeLabel: {
    fontSize: 11,
    fontFamily: 'Outfit_600SemiBold',
    color: '#2C1206',
  },
  row: {
    flexDirection: 'row',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceTag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priceTagText: {
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  costCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  costTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    marginBottom: 15,
  },
  costDetail: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 15,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    marginRight: 10,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  advanceBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  advanceLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  advanceValue: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  balanceText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    textAlign: 'right',
    marginBottom: 20,
  },
  couponGroup: {
    marginBottom: 25,
  },
  couponLabel: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    marginBottom: 10,
  },
  couponInput: {
    backgroundColor: '#FFF',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
  },
  payBtn: {
    backgroundColor: '#7B3F00',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7B3F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
});

export default AddEvent;
