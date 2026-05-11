import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Image,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TRACKING_STEPS = [
  { id: 1, label: 'Event Created', status: 'In Progress', active: true },
  { id: 2, label: 'Supplier Assigned', status: 'In Queue', active: false },
  { id: 3, label: 'Supplier Arrived', status: 'In Queue', active: false },
  { id: 4, label: 'Event Started', status: 'In Queue', active: false },
  { id: 5, label: 'Event Completed', status: 'In Queue', active: false },
];

const TEAM = {
  manager: { name: 'Jeeva', role: 'Manager', events: 77, rating: 5 },
  supervisor: { name: 'kathir', role: 'Supervisor', events: 42, rating: 4.5 },
  suppliers: [
    { id: 1, name: 'Velu', role: 'Supplier', events: 12, rating: 4 },
    { id: 2, name: 'John', role: 'Supplier', events: 25, rating: 5 },
    { id: 3, name: 'Vetri', role: 'Supplier', events: 8, rating: 4 },
    { id: 4, name: 'jagdeesh', role: 'Supplier', events: 31, rating: 4.5 },
    { id: 5, name: 'joseph', role: 'Supplier', events: 19, rating: 5 },
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
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#2C1206" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tracking</Text>
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

        {/* Status Tracker */}
        <View style={styles.trackerCard}>
          <LinearGradient
            colors={['#FFD700', '#FFB800']}
            style={styles.trackerHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.trackerHeaderText}>Event Status</Text>
          </LinearGradient>

          <View style={styles.stepsContainer}>
            {TRACKING_STEPS.map((step, index) => (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={[styles.stepCircle, step.active && styles.stepCircleActive]}>
                    {step.active && <View style={styles.stepInnerCircle} />}
                  </View>
                  {index < TRACKING_STEPS.length - 1 && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepRight}>
                  <Text style={[styles.stepLabel, !step.active && styles.stepLabelInactive]}>{step.label}</Text>
                  <View style={[styles.statusTag, step.status === 'In Progress' ? styles.progressTag : styles.queueTag]}>
                    <Text style={styles.statusTagText}>{step.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Team Sections */}
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>Manager</Text>
          <TouchableOpacity style={styles.memberItem} onPress={() => openProfile(TEAM.manager)}>
            <View style={styles.memberInfo}>
              <View style={styles.avatarPlaceholder}><Ionicons name="person" size={20} color="#AAA" /></View>
              <Text style={styles.memberName}>{TEAM.manager.name}</Text>
            </View>
            <TouchableOpacity><Ionicons name="chatbubble-ellipses-outline" size={22} color="#AAA" /></TouchableOpacity>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Supervisor</Text>
          <TouchableOpacity style={styles.memberItem} onPress={() => openProfile(TEAM.supervisor)}>
            <View style={styles.memberInfo}>
              <View style={styles.avatarPlaceholder}><Ionicons name="person" size={20} color="#AAA" /></View>
              <Text style={styles.memberName}>{TEAM.supervisor.name}</Text>
            </View>
            <TouchableOpacity><Ionicons name="chatbubble-ellipses-outline" size={22} color="#AAA" /></TouchableOpacity>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Suppliers</Text>
          {TEAM.suppliers.map(sup => (
            <TouchableOpacity key={sup.id} style={[styles.memberItem, styles.supplierItem]} onPress={() => openProfile(sup)}>
              <View style={styles.memberInfo}>
                <View style={styles.avatarPlaceholder}><Ionicons name="person" size={20} color="#AAA" /></View>
                <Text style={styles.memberName}>{sup.name}</Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn}><Ionicons name="remove-circle-outline" size={22} color="#FF4B4B" /></TouchableOpacity>
                <TouchableOpacity><Ionicons name="chatbubble-ellipses-outline" size={22} color="#AAA" /></TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="#333" />
            </TouchableOpacity>

            <View style={styles.modalAvatarContainer}>
              <View style={styles.modalAvatar}>
                <Ionicons name="person" size={60} color="#DDD" />
              </View>
            </View>

            <Text style={styles.modalName}>{selectedMember?.name}</Text>
            <Text style={styles.modalRole}>{selectedMember?.role}</Text>

            <View style={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Ionicons 
                  key={i} 
                  name={i < (selectedMember?.rating || 0) ? "star" : "star-outline"} 
                  size={20} 
                  color="#FFD700" 
                  style={{ marginHorizontal: 2 }}
                />
              ))}
            </View>

            <Text style={styles.modalStats}>Event Attended : {selectedMember?.events || 0}</Text>
          </View>
        </View>
      </Modal>
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
  trackerCard: {
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
  stepsContainer: {
    marginTop: 10,
  },
  stepRow: {
    flexDirection: 'row',
    height: 50,
  },
  stepLeft: {
    width: 30,
    alignItems: 'center',
  },
  stepCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CCC',
    backgroundColor: '#FFF',
    zIndex: 2,
  },
  stepCircleActive: {
    borderColor: '#4CAF50',
  },
  stepInnerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    margin: 2,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#EEE',
    marginVertical: -2,
  },
  stepRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
  },
  stepLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1A1A1A',
  },
  stepLabelInactive: {
    color: '#AAA',
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  progressTag: {
    backgroundColor: '#D2B48C',
  },
  queueTag: {
    backgroundColor: '#DDD',
  },
  statusTagText: {
    fontSize: 10,
    fontFamily: 'Outfit_600SemiBold',
    color: '#FFF',
  },
  teamSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#7B3F00',
    marginTop: 20,
    marginBottom: 15,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  supplierItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 15,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  memberName: {
    fontSize: 15,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1A1A',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    marginRight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  modalAvatarContainer: {
    marginBottom: 15,
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  modalName: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  modalRole: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    marginBottom: 15,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  modalStats: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#333',
  },
});

export default EventTracking;
