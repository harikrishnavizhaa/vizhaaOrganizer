import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../services/api';
import BottomTabBar from './BottomTabBar';

const { width } = Dimensions.get('window');

const StatusScreen = ({ onNavigate, onEventPress }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.getEvents();
      if (res.success) {
        setEvents(res.events || []);
      }
    } catch (err) {
      console.error('Fetch Status Events Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Events</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={20} color="#7B3F00" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7B3F00']} />}
      >
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#7B3F00" />
          </View>
        ) : (
          <>
            {events.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="calendar-blank-outline" size={60} color="#DDD" />
                <Text style={styles.emptyText}>No events found yet.</Text>
              </View>
            ) : (
              events.map(event => (
                <TouchableOpacity 
                  key={event.id} 
                  style={styles.cardContainer}
                  onPress={() => onEventPress(event)}
                  activeOpacity={0.9}
                >
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.typeBadge, { backgroundColor: event.status === 'In Progress' ? '#FFD70022' : '#F5F5F5' }]}>
                        <MaterialCommunityIcons 
                          name={event.type === 'wedding' ? 'ring' : event.type === 'corporate' ? 'briefcase' : 'party-popper'} 
                          size={14} 
                          color={event.status === 'In Progress' ? '#7B3F00' : '#888'} 
                        />
                        <Text style={[styles.typeText, { color: event.status === 'In Progress' ? '#7B3F00' : '#888' }]}>
                          {event.type}
                        </Text>
                      </View>
                      <View style={[styles.statusTag, { backgroundColor: event.status === 'In Progress' ? '#4CAF5015' : '#7B3F0010' }]}>
                        <Text style={[styles.statusText, { color: event.status === 'In Progress' ? '#4CAF50' : '#7B3F00' }]}>
                          {event.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.eventTitle}>{event.name}</Text>
                    
                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={14} color="#B08040" />
                      <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={14} color="#B08040" />
                      <Text style={styles.detailText}>{event.date}  •  {event.inTime}</Text>
                    </View>

                    {event.status === 'In Progress' && (
                      <View style={styles.progressSection}>
                        <View style={styles.progressInfo}>
                          <Text style={styles.progressLabel}>Execution Progress</Text>
                          <Text style={styles.progressVal}>{Math.round((event.progress || 0) * 100)}%</Text>
                        </View>
                        <View style={styles.progressBg}>
                          <View style={[styles.progressFill, { width: `${(event.progress || 0) * 100}%` }]} />
                        </View>
                      </View>
                    )}

                    <View style={styles.cardFooter}>
                      <View style={styles.supplierInfo}>
                        <Ionicons name="people-outline" size={16} color="#999" />
                        <Text style={styles.supplierText}>{event.suppliers} Suppliers assigned</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#CCC" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        )}
      </ScrollView>

      <BottomTabBar activeTab="status" onNavigate={onNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 15,
    paddingBottom: 115,
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  card: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  typeText: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
    textTransform: 'capitalize',
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Outfit_700Bold',
  },
  eventTitle: {
    fontSize: 17,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    flex: 1,
  },
  progressSection: {
    marginTop: 15,
    marginBottom: 5,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: '#444',
  },
  progressVal: {
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
    color: '#4CAF50',
  },
  progressBg: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F8F9FA',
  },
  supplierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  supplierText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#999',
    marginTop: 15,
  },
});

export default StatusScreen;
