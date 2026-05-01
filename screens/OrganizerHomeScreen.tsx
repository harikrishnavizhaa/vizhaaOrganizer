import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { useApp, Event } from '../context/AppContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { getRequests } from '../src/api/request';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function OrganizerHomeScreen() {
    const { user, events, navigate, setSelectedEventId } = useApp();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiStats, setApiStats] = useState({
        total: 0,
        approved: 0,
        pending: 0
    });

    const myEvents = events.filter(e => e.organizerId === user?.phone);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getRequests();
            const data = Array.isArray(res.data?.data ?? res.data) ? (res.data?.data ?? res.data) : [];

            setApiStats({
                total: data.length,
                approved: data.filter((r: any) => r.status === "ACCEPTED" || r.status === "approved").length,
                pending: data.filter((r: any) => r.status === "PENDING" || r.status === "pending").length
            });
        } catch (error: any) {
            // Gracefully fall back to local data if API is unavailable (no token, network error, etc.)
            const statusCode = error?.response?.status;
            if (statusCode === 401 || statusCode === 403 || statusCode === 404) {
                // Use AppContext events as local source of truth
                const localEvents = events.filter(e => e.organizerId === user?.phone);
                setApiStats({
                    total: localEvents.length,
                    approved: localEvents.filter(e => e.status === 'completed').length,
                    pending: localEvents.filter(e => e.status === 'upcoming').length
                });
            } else {
                console.warn("Fetch Data Error:", error?.message || error);
            }
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Organizer'} 👋</Text>
                <View style={styles.locationRow}>
                    <Ionicons name="location-sharp" size={14} color={colors.primary} />
                    <Text style={styles.locationSubtitle}>South, Agaraharam, Komal</Text>
                </View>
            </View>
            <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications-outline" size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigate('profile')}
                >
                    <LinearGradient
                        colors={['#FFD700', '#FFA500']}
                        style={styles.profileGradient}
                    >
                        <Text style={styles.profileInitial}>{user?.name?.[0]?.toUpperCase() || 'H'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStats = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 215, 0, 0.15)' }]}>
                    <MaterialCommunityIcons name="clipboard-text-outline" size={20} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>{apiStats.total}</Text>
                <Text style={styles.statLabel}>Requests</Text>
            </View>

            <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(0, 184, 148, 0.15)' }]}>
                    <MaterialCommunityIcons name="check-circle-outline" size={20} color={colors.success} />
                </View>
                <Text style={styles.statValue}>{apiStats.approved}</Text>
                <Text style={styles.statLabel}>Approved</Text>
            </View>

            <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 165, 0, 0.15)' }]}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color={colors.secondary} />
                </View>
                <Text style={styles.statValue}>{apiStats.pending}</Text>
                <Text style={styles.statLabel}>Pending</Text>
            </View>
        </View>
    );

    const renderEventCard = ({ item }: { item: Event }) => (
        <TouchableOpacity
            style={styles.eventCard}
            onPress={() => {
                setSelectedEventId(item.id);
                navigate('event_status');
            }}
            activeOpacity={0.9}
        >
            <View style={styles.eventCardHeader}>
                <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{item.name}</Text>
                    <Text style={styles.eventType}>{item.type}</Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'completed' ? 'rgba(0, 184, 148, 0.15)' : 'rgba(255, 215, 0, 0.15)' }
                ]}>
                    <Text style={[
                        styles.statusBadgeText,
                        { color: item.status === 'completed' ? colors.success : colors.primary }
                    ]}>
                        {item.status === 'completed' ? 'Success' : 'Active'}
                    </Text>
                </View>
            </View>

            <View style={styles.eventDetails}>
                <View style={styles.detailItem}>
                    <Ionicons name="people-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
                    <Text style={styles.detailText}>{item.assignedPartners.length}/{item.supplierCount} Staffs Joined</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
                    <Text style={styles.detailText}>{new Date().toLocaleDateString()}</Text>
                </View>
            </View>

            <View style={styles.progressBarBg}>
                <View style={[
                    styles.progressBarFill,
                    { width: `${Math.min((item.assignedPartners.length / item.supplierCount) * 100, 100)}%` }
                ]} />
            </View>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            style={styles.container}
        >
            <StatusBar style="light" />
            {renderHeader()}

            <FlatList
                data={myEvents}
                renderItem={renderEventCard}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.scrollContent}
                ListHeaderComponent={
                    <>
                        {renderStats()}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Requests</Text>
                            <TouchableOpacity onPress={() => navigate('history')}>
                                <Text style={styles.viewAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-list-outline" size={80} color="rgba(255, 255, 255, 0.1)" />
                        <Text style={styles.emptyText}>No requests yet</Text>
                        <TouchableOpacity
                            style={styles.createBtnSmall}
                            onPress={() => navigate('create_event')}
                        >
                            <LinearGradient
                                colors={['#FFD700', '#FFA500']}
                                style={styles.createBtnGradient}
                            >
                                <Text style={styles.createBtnSmallText}>Create Your First Event</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigate('create_event')}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    style={styles.fabGradient}
                >
                    <Ionicons name="add" size={34} color="#1E3A5F" />
                </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xxl + 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: 60,
        paddingBottom: spacing.lg,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    locationSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginLeft: 4,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: spacing.md,
        padding: 5,
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    profileGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitial: {
        color: '#1E3A5F',
        fontWeight: '900',
        fontSize: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        marginBottom: spacing.xl,
        gap: 10,
    },
    statCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        flex: 1,
        padding: spacing.md,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 4,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    viewAllText: {
        color: colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    eventCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 20,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    eventCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    eventType: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    eventDetails: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
        gap: 20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.6)',
        marginLeft: 8,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: spacing.md,
        marginBottom: spacing.xl,
        fontWeight: '600',
    },
    createBtnSmall: {
        borderRadius: 25,
        overflow: 'hidden',
    },
    createBtnGradient: {
        paddingHorizontal: 25,
        paddingVertical: 15,
        alignItems: 'center',
    },
    createBtnSmallText: {
        color: '#1E3A5F',
        fontWeight: '800',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 25,
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    fabGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
