import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ATTENDEES = [
  { name: 'Jeeva', role: 'Manager', color: '#FFD700' },
  { name: 'Kathir', role: 'Supervisor', color: '#FFD700' },
  { name: 'Velu', role: 'Supplier', color: '#A0522D' },
  { name: 'John', role: 'Supplier', color: '#A0522D' },
  { name: 'Vetri', role: 'Supplier', color: '#A0522D' },
  { name: 'jagdeesh', role: 'Supplier', color: '#8B4513' },
  { name: 'joseph', role: 'Supplier', color: '#8B4513' },
];

const HistoryDetails = ({ event, onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#2C1206" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Event Card Summary */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#FFF9C4', '#FFF']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.cardContent}>
              <Text style={styles.eventTitle}>{event?.title || "Vijay's Wedding Event"}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color="#333" />
                <Text style={styles.locationText} numberOfLines={2}>{event?.location || "ABC Marriage hall, Coimbatore"}</Text>
              </View>
              <Text style={styles.dateTimeText}>07 JUL, 2026 | 09:00AM-12:00PM IST</Text>
            </View>
            <View style={styles.imageContainer}>
              <MaterialCommunityIcons name="home-heart" size={60} color="#FFB800" />
            </View>
          </LinearGradient>
        </View>

        {/* Main Details Card */}
        <View style={styles.detailsCard}>
          <LinearGradient
            colors={['#FFD700', '#FFB800']}
            style={styles.trackerHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.trackerHeaderText}>Event History</Text>
          </LinearGradient>

          {/* Event Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Status</Text>
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.statusText}>Event Completed</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Event Attendees */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Attendees</Text>
            {ATTENDEES.map((person, i) => (
              <View key={i} style={styles.attendeeItem}>
                <View style={styles.attendeeInfo}>
                  <View style={styles.avatarPlaceholder}><Ionicons name="person" size={18} color="#AAA" /></View>
                  <Text style={styles.attendeeName}>{person.name}</Text>
                  <View style={[styles.roleTag, { backgroundColor: person.color }]}>
                    <Text style={styles.roleTagText}>{person.role}</Text>
                  </View>
                </View>
                <TouchableOpacity><Ionicons name="chatbubble-ellipses-outline" size={20} color="#AAA" /></TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Event Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Details</Text>
            
            <Text style={styles.detailLabel}>Event Type</Text>
            <Text style={styles.detailValue}>Wedding Event</Text>

            <Text style={styles.detailLabel}>Number of Suppliers</Text>
            <Text style={styles.detailValue}>1</Text>

            <Text style={styles.detailLabel}>Dress Code</Text>
            <Text style={styles.detailValue}>White Shirt</Text>

            <Text style={styles.detailLabel}>Number of Services</Text>
            <Text style={styles.detailValue}>Breakfast, Lunch</Text>
          </View>

          <View style={styles.divider} />

          {/* Payment Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            
            <View style={styles.paymentRow}>
              <View style={styles.paymentLabelRow}>
                <Text style={styles.paymentLabel}>Total Payment</Text>
                <View style={[styles.statusSmallTag, { backgroundColor: '#BBB' }]}><Text style={styles.statusSmallTagText}>Pending</Text></View>
              </View>
              <Text style={styles.paymentAmount}>₹1000</Text>
            </View>

            <View style={styles.paymentRow}>
              <View style={styles.paymentLabelRow}>
                <Text style={styles.paymentLabel}>Advance Payment</Text>
                <View style={[styles.statusSmallTag, { backgroundColor: '#90EE90' }]}><Text style={styles.statusSmallTagText}>Paid</Text></View>
              </View>
              <Text style={styles.paymentAmount}>₹250</Text>
            </View>

            <TouchableOpacity style={styles.payBtn}>
              <Text style={styles.payBtnText}>Pay Balance ₹750</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  backBtn: {
    padding: 5,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginTop: 10,
    marginBottom: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 15,
    height: 140,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    marginLeft: 5,
    flex: 1,
  },
  dateTimeText: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    color: '#333',
  },
  imageContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    paddingTop: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  trackerHeader: {
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    position: 'absolute',
    top: -20,
  },
  trackerHeaderText: {
    color: '#2C1206',
    fontSize: 15,
    fontFamily: 'Outfit_700Bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#7B3F00',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 20,
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  attendeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendeeName: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1A1A',
    marginRight: 10,
  },
  roleTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  roleTagText: {
    fontSize: 10,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFF',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1A1A',
    marginTop: 10,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#888',
    marginTop: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  paymentLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1A1A',
    marginRight: 10,
  },
  statusSmallTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusSmallTagText: {
    fontSize: 9,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFF',
  },
  paymentAmount: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1A1A',
  },
  payBtn: {
    backgroundColor: '#7B3F00',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  payBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
});

export default HistoryDetails;
