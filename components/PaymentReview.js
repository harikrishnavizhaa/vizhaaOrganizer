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

const PaymentReview = ({ eventData, onBack, onPay }) => {
  const [paymentType, setPaymentType] = useState('advance'); // 'total' or 'advance'
  
  const totalAmount = (eventData?.selectedServices?.length || 2) * 500;
  const advanceAmount = totalAmount * 0.25;
  const currentPayAmount = paymentType === 'total' ? totalAmount : advanceAmount;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Banner */}
      <View style={styles.bannerContainer}>
        <LinearGradient
          colors={['#004AAD', '#002D6B']}
          style={styles.banner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>SEAMLESS & SECURE PAYMENTS</Text>
              <Text style={styles.bannerSubtitle}>Pay Your Way, Anytime, Anywhere.</Text>
            </View>
            <View style={styles.paymentIcons}>
              <FontAwesome5 name="cc-visa" size={24} color="#FFF" style={styles.icon} />
              <FontAwesome5 name="cc-mastercard" size={24} color="#FFF" style={styles.icon} />
              <FontAwesome5 name="google-pay" size={24} color="#FFF" style={styles.icon} />
              <FontAwesome5 name="apple-pay" size={24} color="#FFF" style={styles.icon} />
            </View>
          </View>
        </LinearGradient>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Review Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Event Name</Text>
            <TouchableOpacity style={styles.editBtn} onPress={onBack}>
              <Text style={styles.editText}>Edit</Text>
              <Ionicons name="pencil" size={14} color="#AAA" />
            </TouchableOpacity>
          </View>
          <Text style={styles.summaryValue}>{eventData?.eventName || "Vijay's Wedding Event"}</Text>

          <Text style={styles.summaryLabel}>Event Type</Text>
          <Text style={styles.summaryValue}>{eventData?.eventType || 'Wedding Event'}</Text>

          <Text style={styles.summaryLabel}>Location</Text>
          <Text style={styles.summaryValue}>{eventData?.location || 'ABC Marriage hall, Coimbatore, Tamilnadu'}</Text>

          <Text style={styles.summaryLabel}>Date</Text>
          <Text style={styles.summaryValue}>{eventData?.date || '22-06-2026'}</Text>

          <Text style={styles.summaryLabel}>Time</Text>
          <Text style={styles.summaryValue}>06:09 AM - 12:12 PM</Text>

          <Text style={styles.summaryLabel}>Number of Suppliers</Text>
          <Text style={styles.summaryValue}>1</Text>

          <Text style={styles.summaryLabel}>Dress Code</Text>
          <Text style={styles.summaryValue}>White Shirt</Text>

          <Text style={styles.summaryLabel}>Number of Services</Text>
          <Text style={styles.summaryValue}>Breakfast, Lunch</Text>
        </View>

        {/* Cost & Payment Selection */}
        <View style={styles.paymentCard}>
          <Text style={styles.costTitle}>Estimated Cost</Text>
          <Text style={styles.costDetail}>Services : {eventData?.selectedServices?.length || 2} x ₹500</Text>
          <Text style={styles.costDetail}>Suppliers : 1</Text>
          
          <View style={styles.divider} />

          {/* Payment Options */}
          <TouchableOpacity 
            style={styles.optionRow} 
            onPress={() => setPaymentType('total')}
          >
            <View style={styles.radioGroup}>
              <View style={[styles.radio, paymentType === 'total' && styles.radioActive]}>
                {paymentType === 'total' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionLabel}>Total Payment</Text>
            </View>
            <Text style={styles.optionValue}>₹{totalAmount}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionRow} 
            onPress={() => setPaymentType('advance')}
          >
            <View style={styles.radioGroup}>
              <View style={[styles.radio, paymentType === 'advance' && styles.radioActive]}>
                {paymentType === 'advance' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionLabel}>Advance Payment</Text>
            </View>
            <Text style={styles.optionValue}>₹{advanceAmount}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total :</Text>
            <Text style={styles.totalPrice}>₹{currentPayAmount}</Text>
          </View>

          <View style={styles.advanceBar}>
            <Text style={styles.advanceLabel}>Advance to Pay(25%) :</Text>
            <Text style={styles.advanceValue}>₹{advanceAmount}</Text>
          </View>
          <Text style={styles.balanceText}>Balance after event : ₹{totalAmount - currentPayAmount}</Text>

          <View style={styles.couponGroup}>
            <Text style={styles.couponLabel}>Coupon code</Text>
            <TextInput 
              style={styles.couponInput}
              placeholder="Enter your Vizhaa's voucher"
              placeholderTextColor="#BBB"
            />
          </View>

          <TouchableOpacity style={styles.payBtn} onPress={() => onPay(currentPayAmount)}>
            <Text style={styles.payBtnText}>Pay ₹{currentPayAmount}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav Placeholder */}
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
  },
  banner: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    lineHeight: 22,
  },
  bannerSubtitle: {
    color: '#rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    marginTop: 5,
  },
  paymentIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 100,
    justifyContent: 'flex-end',
    gap: 10,
  },
  icon: {
    marginLeft: 10,
  },
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
  summaryCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  summaryTitle: {
    fontSize: 15,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#AAA',
    marginRight: 5,
  },
  summaryLabel: {
    fontSize: 15,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    marginTop: 15,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#888',
  },
  paymentCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
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
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioActive: {
    borderColor: '#4CAF50',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  optionValue: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  totalRow: {
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
  totalPrice: {
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
  },
  payBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
});

export default PaymentReview;
