import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomTabBar from './BottomTabBar';
import { api } from '../services/api';

const HistoryScreen = ({ onNavigate, onEventPress }) => {
  const [historyEvents, setHistoryEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.getEvents();
      if (res.success && res.events) {
        // Filter events that have status "Completed"
        const completedEvents = res.events.filter(e => e.status === 'Completed');
        // Sort by creation date or end date (newest first)
        completedEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setHistoryEvents(completedEvents);
      }
    } catch (err) {
      console.error('Fetch History Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7B3F00" />
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={historyEvents.length === 0 ? styles.emptyScrollContent : styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7B3F00']} />}
        >
          {historyEvents.length > 0 ? (
            historyEvents.map(event => (
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
                      <Text style={styles.eventTitle} numberOfLines={1}>{event.name}</Text>
                      <View style={styles.locationRow}>
                        <Ionicons name="location" size={14} color="#333" />
                        <Text style={styles.locationText} numberOfLines={2}>{event.location}</Text>
                      </View>
                      <Text style={styles.dateTimeText}>{event.inDate || event.date} | {event.inTime || event.time}</Text>
                    </View>
                    
                    <View style={styles.imageContainer}>
                      <MaterialCommunityIcons 
                        name={event.type === 'wedding' ? 'home-heart' : event.type === 'corporate' ? 'office-building' : 'party-popper'} 
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
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="history" size={60} color="#DDD" />
              <Text style={styles.emptyText}>No completed events found.</Text>
            </View>
          )}
        </ScrollView>
      )}

      <BottomTabBar activeTab="history" onNavigate={onNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 115,
    paddingHorizontal: 20,
  },
  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 115,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#999',
    marginTop: 15,
  },
});

export default HistoryScreen;
