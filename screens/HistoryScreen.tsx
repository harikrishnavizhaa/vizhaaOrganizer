import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    RefreshControl,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Event } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme/colors';

const { width } = Dimensions.get('window');

export default function HistoryScreen() {
    const { events, user, navigate } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const pastEvents = useMemo(() => {
        if (!user) return [];
        return events.filter(event =>
            event.organizerId === user.phone &&
            (event.status === 'completed' || event.status === 'cancelled')
        );
    }, [events, user]);

    const filteredEvents = useMemo(() => {
        if (!searchQuery.trim()) return pastEvents;
        const query = searchQuery.toLowerCase();
        return pastEvents.filter(event =>
            event.name.toLowerCase().includes(query) ||
            event.type.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query)
        );
    }, [pastEvents, searchQuery]);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    return (
        <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            style={styles.container}
        >
            <StatusBar style="light" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Event History</Text>
                    <Text style={styles.headerSubtitle}>{pastEvents.length} Past Requests</Text>
                </View>
                <TouchableOpacity onPress={() => navigate('profile')} style={styles.profileBtn}>
                    <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.profileGradient}>
                        <Text style={styles.profileInitial}>{user?.name?.[0]?.toUpperCase() || 'H'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.4)" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search past events..."
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.3)" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {filteredEvents.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="history" size={80} color="rgba(255, 255, 255, 0.1)" />
                        <Text style={styles.emptyTitle}>
                            {searchQuery ? 'No matches' : 'No history yet'}
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            {searchQuery ? 'Try a different search' : 'Completed requests will appear here'}
                        </Text>
                    </View>
                ) : (
                    filteredEvents.map(event => (
                        <EventHistoryCard key={event.id} event={event} />
                    ))
                )}
            </ScrollView>
        </LinearGradient>
    );
}

function EventHistoryCard({ event }: { event: Event }) {
    const isCompleted = event.status === 'completed';
    const statusColor = isCompleted ? colors.success : colors.error;

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleBox}>
                    <Text style={styles.cardTitle}>{event.name}</Text>
                    <Text style={styles.cardType}>{event.type}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '20', borderColor: statusColor }]}>
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {isCompleted ? 'Completed' : 'Cancelled'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardDetails}>
                <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.detailText}>{event.date}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={16} color="rgba(255, 255, 255, 0.4)" />
                    <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.paymentBox}>
                    <Text style={styles.paymentLabel}>PAID</Text>
                    <Text style={styles.paymentValue}>₹{event.paidAmount || 0}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.paymentBox}>
                    <Text style={styles.paymentLabel}>TOTAL</Text>
                    <Text style={styles.totalValue}>₹{event.totalAmount || 0}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 25,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        overflow: 'hidden',
    },
    profileGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInitial: {
        color: '#1E3A5F',
        fontWeight: '900',
        fontSize: 18,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginHorizontal: 25,
        marginBottom: 20,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#FFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    cardTitleBox: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
    },
    cardType: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    cardDetails: {
        marginBottom: 20,
        gap: 10,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 15,
        borderRadius: 15,
    },
    paymentBox: {
        flex: 1,
        alignItems: 'center',
    },
    paymentLabel: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.4)',
        fontWeight: '800',
        marginBottom: 4,
    },
    paymentValue: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.success,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
    },
    divider: {
        width: 1,
        height: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.3)',
        textAlign: 'center',
    },
});
