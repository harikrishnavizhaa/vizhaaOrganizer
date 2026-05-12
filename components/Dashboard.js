import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import BottomTabBar from './BottomTabBar';

const { width } = Dimensions.get('window');

const Dashboard = ({ onAddEvent, onNavigate, onEventPress }) => {
  const { user } = useAuth();
  const userName = user?.name || 'User';

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.getEvents();
      if (res.success) {
        setEvents(res.events || []);
        setFilteredEvents(res.events || []);
      }
    } catch (err) {
      console.error('Fetch Dashboard Events Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(e =>
        e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const activeEvents = filteredEvents.filter(e => e.status === 'In Progress');
  const upcomingEvents = filteredEvents.filter(e => e.status === 'Upcoming');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7B3F00']} />}
      >

        {/* Header Section */}
        <LinearGradient
          colors={['#2C1206', '#5C2E00']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{userName[0]}</Text>
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.userName}>{userName}!</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
              <View style={styles.dot} />
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <StatItem label="Active" value={String(activeEvents.length).padStart(2, '0')} icon="flash" color="#FFD700" />
            <StatItem label="Upcoming" value={String(upcomingEvents.length).padStart(2, '0')} icon="time" color="#FFF" />
            <StatItem label="Completed" value={String(events.filter(e => e.status === 'Completed').length).padStart(2, '0')} icon="checkmark-circle" color="#4CAF50" />
          </View>
        </LinearGradient>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search your events..."
              style={styles.searchInput}
              placeholderTextColor="#BBB"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#7B3F00" />
          </View>
        ) : (
          <>
            {/* Active Event Section */}
            {activeEvents.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Active Event</Text>
                  <TouchableOpacity onPress={() => onNavigate('status')}>
                    <Text style={styles.seeAll}>View All</Text>
                  </TouchableOpacity>
                </View>

                {activeEvents.slice(0, 1).map(event => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.activeCardContainer}
                    activeOpacity={0.9}
                    onPress={() => onEventPress(event)}
                  >
                    <LinearGradient
                      colors={['#FFF', '#FDFBF7']}
                      style={styles.activeCard}
                    >
                      <View style={styles.cardTop}>
                        <View style={[styles.typeBadge, { backgroundColor: '#FFD70022' }]}>
                          <MaterialCommunityIcons
                            name={event.type === 'wedding' ? 'ring' : event.type === 'corporate' ? 'briefcase' : 'party-popper'}
                            size={16} color="#7B3F00"
                          />
                          <Text style={styles.typeBadgeText}>{event.type}</Text>
                        </View>
                        <View style={styles.liveBadge}>
                          <View style={styles.liveDot} />
                          <Text style={styles.liveText}>LIVE</Text>
                        </View>
                      </View>

                      <Text style={styles.eventTitle}>{event.name}</Text>
                      <View style={styles.infoRow}>
                        <Ionicons name="location-sharp" size={14} color="#7B3F00" />
                        <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
                      </View>

                      <View style={styles.progressContainer}>
                        <View style={styles.progressHeader}>
                          <Text style={styles.progressLabel}>Execution Progress</Text>
                          <Text style={styles.progressValue}>{Math.round((event.progress || 0) * 100)}%</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                          <LinearGradient
                            colors={['#7B3F00', '#B08040']}
                            style={[styles.progressBarFill, { width: `${(event.progress || 0) * 100}%` }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          />
                        </View>
                      </View>

                      <View style={styles.cardFooter}>
                        <View style={styles.footerItem}>
                          <Ionicons name="calendar" size={14} color="#999" />
                          <Text style={styles.footerText}>{event.date}</Text>
                        </View>
                        <View style={styles.footerItem}>
                          <Ionicons name="people" size={14} color="#999" />
                          <Text style={styles.footerText}>{event.suppliers} Suppliers</Text>
                        </View>
                        <TouchableOpacity style={styles.trackBtn} onPress={() => onEventPress(event)}>
                          <Text style={styles.trackText}>Track</Text>
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Upcoming Events Section - Only show if there are events */}
            {events.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{upcomingEvents.length > 0 ? 'Upcoming Events' : 'Quick Actions'}</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.upcomingScroll}>
                  {upcomingEvents.map(event => (
                    <TouchableOpacity
                      key={event.id}
                      style={styles.upcomingCard}
                      onPress={() => onEventPress(event)}
                    >
                      <View style={styles.dateBox}>
                        <Text style={styles.dateDay}>{event.date.split('/')[0] || event.date.split(' ')[0]}</Text>
                        <Text style={styles.dateMonth}>{event.date.split('/')[1] ? 'MON' : (event.date.split(' ')[1] || 'DAY')}</Text>
                      </View>
                      <View style={styles.upcomingContent}>
                        <Text style={styles.upcomingTitle} numberOfLines={1}>{event.name}</Text>
                        <Text style={styles.upcomingLoc} numberOfLines={1}>{event.location}</Text>
                        <View style={styles.upcomingMeta}>
                          <Ionicons name="time-outline" size={12} color="#888" />
                          <Text style={styles.upcomingTime}>{event.inTime}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </>
        )}

        {/* Empty State - Only show if NO events at all */}
        {!loading && events.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={60} color="#DDD" />
            <Text style={styles.emptyText}>No events found yet.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={onAddEvent}>
              <Text style={styles.emptyBtnText}>Create your first event</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Banner Section */}
        <TouchableOpacity style={styles.promoBanner}>
          <LinearGradient
            colors={['#FFD700', '#FFB800']}
            style={styles.promoInner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View>
              <Text style={styles.promoTitle}>Plan Better with Vizhaa</Text>
              <Text style={styles.promoSub}>Get premium supplier contacts</Text>
            </View>
            <MaterialCommunityIcons name="star-circle" size={40} color="#2C1206" opacity={0.3} />
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>

      <BottomTabBar activeTab="dashboard" onNavigate={onNavigate} />

      {/* Premium Extended Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={onAddEvent}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#7B3F00', '#4A2600']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={24} color="#FFF" />
          <Text style={styles.fabText}>Add Event</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const StatItem = ({ label, value, icon, color }) => (
  <View style={styles.statBox}>
    <View style={[styles.statIconWrap, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarInitial: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  welcomeText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: 'rgba(255,255,255,0.7)',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#FFF',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#2C1206',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    width: width * 0.28,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Outfit_400Regular',
    color: 'rgba(255,255,255,0.6)',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: -25,
    marginBottom: 25,
  },
  searchBar: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    height: 54,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  seeAll: {
    fontSize: 13,
    fontFamily: 'Outfit_600SemiBold',
    color: '#7B3F00',
  },
  activeCardContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  activeCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    color: '#7B3F00',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEE',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4B4B',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontFamily: 'Outfit_700Bold',
    color: '#FF4B4B',
  },
  eventTitle: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: '#444',
  },
  progressValue: {
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
    color: '#7B3F00',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 15,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: '#888',
  },
  trackBtn: {
    backgroundColor: '#2C1206',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
  },
  trackText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
  },
  upcomingScroll: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  upcomingCard: {
    width: 220,
    height: 90,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  dateBox: {
    width: 55,
    height: 65,
    backgroundColor: '#FDFBF7',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E6D2',
  },
  dateDay: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  dateMonth: {
    fontSize: 10,
    fontFamily: 'Outfit_700Bold',
    color: '#B08040',
    textTransform: 'uppercase',
  },
  upcomingContent: {
    flex: 1,
    marginLeft: 12,
  },
  upcomingTitle: {
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
    color: '#333',
    marginBottom: 2,
  },
  upcomingLoc: {
    fontSize: 11,
    fontFamily: 'Outfit_400Regular',
    color: '#999',
    marginBottom: 5,
  },
  upcomingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  upcomingTime: {
    fontSize: 10,
    fontFamily: 'Outfit_600SemiBold',
    color: '#888',
  },
  addSmallCard: {
    width: 100,
    height: 90,
    marginRight: 20,
  },
  addSmallInner: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addSmallText: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    color: '#7B3F00',
  },
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 22,
    overflow: 'hidden',
  },
  promoInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 22,
  },
  promoTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    marginBottom: 4,
  },
  promoSub: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: 'rgba(44, 18, 6, 0.6)',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#999',
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
  },
  emptyBtn: {
    backgroundColor: '#7B3F00',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    height: 54,
    borderRadius: 27,
    shadowColor: '#2C1206',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    gap: 8,
  },
  fabText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Outfit_700Bold',
    letterSpacing: 0.5,
  },
});

export default Dashboard;
