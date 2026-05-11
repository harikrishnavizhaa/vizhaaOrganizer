import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomTabBar from './BottomTabBar';

const HISTORY_EVENTS = [
  {
    id: '1',
    title: "Vijay's Wedding Event",
    location: "Lorem ipsum dolor sit amet consecteturit amet consectetur",
    date: "07 JUL, 2026",
    time: "09:00AM-12:00PM IST",
    type: 'wedding'
  },
  {
    id: '2',
    title: "Corporate Strategy Meeting",
    location: "Lorem ipsum dolor sit amet consecteturit amet consectetur",
    date: "14 JUL, 2026",
    time: "12:30PM-4:00PM IST",
    type: 'corporate'
  },
  {
    id: '3',
    title: "Summer Music Festival",
    location: "Lorem ipsum dolor sit amet consecteturit amet consectetur",
    date: "21 JUL, 2026",
    time: "15:45PM-20:00PM IST",
    type: 'other'
  }
];

const HistoryScreen = ({ onNavigate, onEventPress }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {HISTORY_EVENTS.map(event => (
          <TouchableOpacity 
            key={event.id} 
            style={styles.cardWrapper}
            onPress={() => onEventPress(event)}
          >
            <View style={styles.cardContainer}>
              <LinearGradient
                colors={['#FFF9C4', '#FFF']}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color="#333" />
                    <Text style={styles.locationText} numberOfLines={2}>{event.location}</Text>
                  </View>
                  <Text style={styles.dateTimeText}>{event.date} | {event.time}</Text>
                </View>
                
                <View style={styles.imageContainer}>
                  <MaterialCommunityIcons 
                    name={event.type === 'wedding' ? 'home-heart' : event.type === 'corporate' ? 'office-building' : 'music-note'} 
                    size={60} 
                    color="#FFB800" 
                  />
                  <View style={styles.cloudShadow} />
                </View>
              </LinearGradient>
            </View>
            {/* Dropdown Arrow Tab */}
            <View style={styles.dropdownTab}>
              <Ionicons name="chevron-down" size={18} color="#2C1206" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomTabBar activeTab="history" onNavigate={onNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 115,
    paddingHorizontal: 20,
  },
  cardWrapper: {
    marginBottom: 30,
    alignItems: 'flex-end',
  },
  cardContainer: {
    width: '100%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    backgroundColor: '#FFF',
  },
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 15,
    height: 150,
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
    marginBottom: 20,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    marginLeft: 5,
    lineHeight: 16,
    flex: 1,
  },
  dateTimeText: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    color: '#333',
  },
  imageContainer: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cloudShadow: {
    width: 70,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 35,
    marginTop: -5,
  },
  dropdownTab: {
    width: 40,
    height: 25,
    backgroundColor: '#E8E8E8',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -1,
    marginRight: 10,
  },
});

export default HistoryScreen;
