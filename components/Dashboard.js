import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import BottomTabBar from './BottomTabBar';

const Dashboard = ({ onAddEvent, onNavigate }) => {
  const { user } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'Vijay';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <LinearGradient 
          colors={['#FFD700', '#FFB800']} 
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <Text style={styles.greetingText}>Hello {userName}!</Text>
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications" size={22} color="#FFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
              <TextInput 
                placeholder="Search Events" 
                placeholderTextColor="#999"
                style={styles.searchInput}
              />
            </View>
          </View>
        </LinearGradient>

        {/* Featured Card */}
        <View style={styles.featuredCardContainer}>
          <LinearGradient
            colors={['#D2B48C33', '#FFF']}
            style={styles.featuredCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Lorum Ipsum</Text>
              <Text style={styles.cardSubtitle}>
                Lorem ipsum dolor sit amet consectetur.
              </Text>
              <TouchableOpacity style={styles.addEventBtn} onPress={onAddEvent}>
                <Text style={styles.addEventText}>Add Event</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardImageContainer}>
              <MaterialCommunityIcons name="calendar-multiselect" size={80} color="#FFD700" />
            </View>
          </LinearGradient>
        </View>

      </ScrollView>

      <BottomTabBar activeTab="dashboard" onNavigate={onNavigate} />
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
  header: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    marginRight: 12,
  },
  greetingText: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C1206',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B4B',
    borderWidth: 1.5,
    borderColor: '#2C1206',
  },
  searchContainer: {
    position: 'absolute',
    bottom: -25,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchBar: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: '#333',
  },
  featuredCardContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  featuredCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 20,
    height: 160,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    marginBottom: 15,
    lineHeight: 18,
  },
  addEventBtn: {
    backgroundColor: '#7B3F00',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  addEventText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
  },
  cardImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default Dashboard;
