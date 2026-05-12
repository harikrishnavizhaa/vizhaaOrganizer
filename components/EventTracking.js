import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TRACKING_STEPS = [
  { id: 1, label: 'Event Created', status: 'Completed', time: '09:00 AM', active: true, done: true },
  { id: 2, label: 'Supplier Assigned', status: 'In Progress', time: '09:15 AM', active: true, done: false },
  { id: 3, label: 'Supplier Arrived', status: 'In Queue', time: '--:--', active: false, done: false },
  { id: 4, label: 'Event Started', status: 'In Queue', time: '--:--', active: false, done: false },
  { id: 5, label: 'Event Completed', status: 'In Queue', time: '--:--', active: false, done: false },
];

const TEAM = {
  manager: { name: 'Jeeva', role: 'Manager', events: 77, rating: 5, phone: '9876543210' },
  supervisor: { name: 'Kathir', role: 'Supervisor', events: 42, rating: 4.5, phone: '9876543211' },
  suppliers: [
    { id: 1, name: 'Velu', role: 'Supplier', events: 12, rating: 4 },
    { id: 2, name: 'John', role: 'Supplier', events: 25, rating: 5 },
    { id: 3, name: 'Vetri', role: 'Supplier', events: 8, rating: 4 },
  ]
};

const EventTracking = ({ event, onBack }) => {
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const openProfile = (member) => {
    setSelectedMember(member);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Premium Transparent Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Tracking</Text>
        <TouchableOpacity style={styles.helpBtn}>
          <Ionicons name="help-circle-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Main Event Card - Glassmorphism Style */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#2C1206', '#5C2E00']}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroStatus}>IN PROGRESS</Text>
                <Text style={styles.heroTitle}>{event?.name || "Wedding Celebration"}</Text>
              </View>
              <View style={styles.heroIconBox}>
                <MaterialCommunityIcons 
                  name={event?.type === 'wedding' ? 'ring' : 'party-popper'} 
                  size={40} color="#FFD700" 
                />
              </View>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroFooter}>
              <View style={styles.heroInfoItem}>
                <Ionicons name="location" size={14} color="#FFD700" />
                <Text style={styles.heroInfoText}>{event?.location || "Coimbatore"}</Text>
              </View>
              <View style={styles.heroInfoItem}>
                <Ionicons name="calendar" size={14} color="#FFD700" />
                <Text style={styles.heroInfoText}>{event?.date || "Today"}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Dynamic Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Execution Timeline</Text>
          <View style={styles.timelineCard}>
            {TRACKING_STEPS.map((step, index) => (
              <View key={step.id} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <Text style={[styles.timelineTime, !step.active && { color: '#CCC' }]}>{step.time}</Text>
                </View>
                
                <View style={styles.timelineCenter}>
                  <View style={[
                    styles.timelineDot, 
                    step.done && styles.dotDone,
                    step.status === 'In Progress' && styles.dotActive
                  ]}>
                    {step.done && <Ionicons name="checkmark" size={10} color="#FFF" />}
                  </View>
                  {index < TRACKING_STEPS.length - 1 && (
                    <View style={[styles.timelineLine, step.done && styles.lineDone]} />
                  )}
                </View>

                <View style={styles.timelineRight}>
                  <Text style={[styles.timelineLabel, !step.active && { color: '#999' }]}>{step.label}</Text>
                  <Text style={[styles.timelineStatus, { color: step.done ? '#4CAF50' : (step.status === 'In Progress' ? '#7B3F00' : '#AAA') }]}>
                    {step.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Premium Team Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>On-Site Support</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Emergency Call</Text></TouchableOpacity>
          </View>

          <View style={styles.teamGrid}>
            <TeamMemberCard member={TEAM.manager} onPress={() => openProfile(TEAM.manager)} />
            <TeamMemberCard member={TEAM.supervisor} onPress={() => openProfile(TEAM.supervisor)} />
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Assigned Suppliers ({TEAM.suppliers.length})</Text>
          {TEAM.suppliers.map(sup => (
            <TouchableOpacity key={sup.id} style={styles.supplierRow} onPress={() => openProfile(sup)}>
              <View style={styles.supplierAvatar}>
                <Ionicons name="person" size={20} color="#7B3F00" />
              </View>
              <View style={styles.supplierInfo}>
                <Text style={styles.supplierName}>{sup.name}</Text>
                <Text style={styles.supplierRole}>{sup.role}</Text>
              </View>
              <View style={styles.supplierActions}>
                <TouchableOpacity style={styles.miniCallBtn}>
                  <Ionicons name="call" size={16} color="#7B3F00" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Premium Profile Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle" size={32} color="#DDD" />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <View style={styles.modalAvatarBox}>
                <Ionicons name="person" size={60} color="#7B3F00" />
              </View>
              <Text style={styles.modalName}>{selectedMember?.name}</Text>
              <Text style={styles.modalRole}>{selectedMember?.role}</Text>
            </View>

            <View style={styles.modalStatsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{selectedMember?.events}</Text>
                <Text style={styles.statLbl}>Events</Text>
              </View>
              <View style={[styles.statBox, styles.statDivider]}>
                <Text style={styles.statVal}>{selectedMember?.rating}★</Text>
                <Text style={styles.statLbl}>Rating</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>Active</Text>
                <Text style={styles.statLbl}>Status</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.modalCallBtn}>
              <LinearGradient colors={['#7B3F00', '#4A2600']} style={styles.modalCallGradient}>
                <Ionicons name="call" size={20} color="#FFF" />
                <Text style={styles.modalCallText}>Call {selectedMember?.role}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const TeamMemberCard = ({ member, onPress }) => (
  <TouchableOpacity style={styles.teamCard} onPress={onPress}>
    <View style={styles.teamCardAvatar}>
      <Ionicons name="person" size={24} color="#FFF" />
    </View>
    <Text style={styles.teamCardName}>{member.name}</Text>
    <Text style={styles.teamCardRole}>{member.role}</Text>
    <View style={styles.teamCardRating}>
      <Ionicons name="star" size={12} color="#FFD700" />
      <Text style={styles.teamCardRatingText}>{member.rating}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2C1206',
  },
  headerTitle: { fontSize: 18, fontFamily: 'Outfit_700Bold', color: '#FFF' },
  backBtn: { padding: 5 },
  helpBtn: { padding: 5 },
  scrollContent: { paddingBottom: 40 },

  heroSection: { padding: 20, backgroundColor: '#2C1206', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  heroCard: { borderRadius: 24, padding: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroStatus: { color: '#FFD700', fontSize: 10, fontFamily: 'Outfit_700Bold', letterSpacing: 1 },
  heroTitle: { color: '#FFF', fontSize: 22, fontFamily: 'Outfit_700Bold', marginTop: 4 },
  heroIconBox: { width: 60, height: 60, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
  heroFooter: { flexDirection: 'row', gap: 20 },
  heroInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroInfoText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Outfit_400Regular' },

  section: { paddingHorizontal: 20, marginTop: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 17, fontFamily: 'Outfit_700Bold', color: '#2C1206' },
  seeAll: { fontSize: 12, fontFamily: 'Outfit_700Bold', color: '#7B3F00' },

  timelineCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  timelineRow: { flexDirection: 'row', height: 70 },
  timelineLeft: { width: 60, paddingTop: 2 },
  timelineTime: { fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: '#666' },
  timelineCenter: { width: 30, alignItems: 'center' },
  timelineDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  dotDone: { backgroundColor: '#4CAF50' },
  dotActive: { backgroundColor: '#7B3F00', borderWidth: 4, borderColor: '#FFD700' },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#EEE', marginVertical: -2 },
  lineDone: { backgroundColor: '#4CAF50' },
  timelineRight: { flex: 1, paddingLeft: 15 },
  timelineLabel: { fontSize: 14, fontFamily: 'Outfit_700Bold', color: '#2C1206' },
  timelineStatus: { fontSize: 11, fontFamily: 'Outfit_400Regular', marginTop: 2 },

  teamGrid: { flexDirection: 'row', gap: 15 },
  teamCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 15, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  teamCardAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#7B3F00', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  teamCardName: { fontSize: 14, fontFamily: 'Outfit_700Bold', color: '#2C1206' },
  teamCardRole: { fontSize: 10, fontFamily: 'Outfit_400Regular', color: '#666', marginTop: 2 },
  teamCardRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, backgroundColor: '#FFF9E6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  teamCardRatingText: { fontSize: 10, fontFamily: 'Outfit_700Bold', color: '#7B3F00' },

  supplierRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 16, marginBottom: 10, elevation: 1 },
  supplierAvatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5EFE6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  supplierInfo: { flex: 1 },
  supplierName: { fontSize: 14, fontFamily: 'Outfit_700Bold', color: '#2C1206' },
  supplierRole: { fontSize: 11, fontFamily: 'Outfit_400Regular', color: '#888' },
  supplierActions: { flexDirection: 'row', gap: 10 },
  miniCallBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F5EFE6', justifyContent: 'center', alignItems: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, alignItems: 'center' },
  modalHandle: { width: 40, height: 4, backgroundColor: '#EEE', borderRadius: 2, marginBottom: 20 },
  modalClose: { position: 'absolute', top: 20, right: 20 },
  modalHeader: { alignItems: 'center', marginBottom: 25 },
  modalAvatarBox: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5EFE6', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  modalName: { fontSize: 22, fontFamily: 'Outfit_700Bold', color: '#2C1206' },
  modalRole: { fontSize: 14, fontFamily: 'Outfit_400Regular', color: '#7B3F00', marginTop: 4 },
  modalStatsRow: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 20, padding: 20, width: '100%', marginBottom: 30 },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#EEE' },
  statVal: { fontSize: 18, fontFamily: 'Outfit_700Bold', color: '#2C1206' },
  statLbl: { fontSize: 12, fontFamily: 'Outfit_400Regular', color: '#999', marginTop: 4 },
  modalCallBtn: { width: '100%', height: 56, borderRadius: 16, overflow: 'hidden' },
  modalCallGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  modalCallText: { color: '#FFF', fontSize: 16, fontFamily: 'Outfit_700Bold' },
});

export default EventTracking;
