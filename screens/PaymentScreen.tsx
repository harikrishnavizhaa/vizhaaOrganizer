import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Event } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme/colors';

const { width } = Dimensions.get('window');

type TabType = 'upcoming' | 'past';
type FilterType = 'all' | 'pending' | 'advance_paid' | 'full_paid';

export default function PaymentScreen() {
    const { events, user, navigate } = useApp();
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [filter, setFilter] = useState<FilterType>('all');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const filteredEvents = useMemo(() => {
        if (!user) return [];
        const userEvents = events.filter(event => event.organizerId === user.phone);
        const tabFiltered = activeTab === 'upcoming'
            ? userEvents.filter(e => e.status === 'upcoming' || e.status === 'started')
            : userEvents.filter(e => e.status === 'completed' || e.status === 'cancelled');

        if (filter === 'all') return tabFiltered;
        return tabFiltered.filter(e => e.paymentStatus === filter);
    }, [events, user, activeTab, filter]);

    const stats = useMemo(() => {
        const total = filteredEvents.reduce((sum, e) => sum + e.totalAmount, 0);
        const paid = filteredEvents.reduce((sum, e) => sum + e.paidAmount, 0);
        const pending = total - paid;
        return { total, paid, pending };
    }, [filteredEvents]);

    return (
        <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            style={styles.container}
        >
            <StatusBar style="light" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Payments</Text>
                    <Text style={styles.headerSubtitle}>Finance Tracking</Text>
                </View>
                <TouchableOpacity onPress={() => navigate('profile')} style={styles.profileBtn}>
                    <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.profileGradient}>
                        <Text style={styles.profileInitial}>{user?.name?.[0]?.toUpperCase() || 'H'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Received</Text>
                    <Text style={[styles.summaryValue, { color: colors.success }]}>₹{stats.paid.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Pending</Text>
                    <Text style={[styles.summaryValue, { color: '#FF5252' }]}>₹{stats.pending.toLocaleString()}</Text>
                </View>
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'upcoming' && styles.activeTabItem]}
                    onPress={() => setActiveTab('upcoming')}
                >
                    <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'past' && styles.activeTabItem]}
                    onPress={() => setActiveTab('past')}
                >
                    <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>History</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filterBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    <FilterButton label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
                    <FilterButton label="Pending" active={filter === 'pending'} onPress={() => setFilter('pending')} color="#FF5252" />
                    <FilterButton label="Advance" active={filter === 'advance_paid'} onPress={() => setFilter('advance_paid')} color="#FFC107" />
                    <FilterButton label="Full" active={filter === 'full_paid'} onPress={() => setFilter('full_paid')} color={colors.success} />
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {filteredEvents.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="wallet-outline" size={80} color="rgba(255, 255, 255, 0.1)" />
                        <Text style={styles.emptyText}>No matching payments</Text>
                    </View>
                ) : (
                    filteredEvents.map(event => (
                        <PaymentCard key={event.id} event={event} onPress={() => setSelectedEvent(event)} />
                    ))
                )}
            </ScrollView>

            <PaymentDetailModal
                event={selectedEvent}
                visible={selectedEvent !== null}
                onClose={() => setSelectedEvent(null)}
            />
        </LinearGradient>
    );
}

function FilterButton({ label, active, onPress, color }: any) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.filterBtn,
                active && { backgroundColor: color || colors.primary, borderColor: color || colors.primary }
            ]}
        >
            <Text style={[styles.filterBtnText, active && styles.activeFilterTxt]}>{label}</Text>
        </TouchableOpacity>
    );
}

function PaymentCard({ event, onPress }: { event: Event, onPress: () => void }) {
    const remaining = event.totalAmount - event.paidAmount;
    const progress = (event.paidAmount / event.totalAmount) * 100;

    const getStatusInfo = () => {
        switch (event.paymentStatus) {
            case 'full_paid': return { color: colors.success, label: 'Full Paid' };
            case 'advance_paid': return { color: '#FFC107', label: 'Advance' };
            default: return { color: '#FF5252', label: 'Pending' };
        }
    };

    const status = getStatusInfo();

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.cardTitle}>{event.name}</Text>
                    <Text style={styles.cardDate}>{event.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.color + '20', borderColor: status.color }]}>
                    <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
                </View>
            </View>

            <View style={styles.amountArea}>
                <View style={styles.amtBox}>
                    <Text style={styles.amtLabel}>Paid</Text>
                    <Text style={[styles.amtValue, { color: colors.success }]}>₹{event.paidAmount || 0}</Text>
                </View>
                <View style={[styles.divider, { width: 1, height: 20 }]} />
                <View style={styles.amtBox}>
                    <Text style={styles.amtLabel}>Dues</Text>
                    <Text style={[styles.amtValue, { color: '#FF5252' }]}>₹{remaining}</Text>
                </View>
                <View style={[styles.divider, { width: 1, height: 20 }]} />
                <View style={styles.amtBox}>
                    <Text style={styles.amtLabel}>Total</Text>
                    <Text style={[styles.amtValue, { color: '#FFF' }]}>₹{event.totalAmount}</Text>
                </View>
            </View>

            <View style={styles.progressBox}>
                <View style={styles.barContainer}>
                    <View style={[styles.barFill, { width: `${progress}%`, backgroundColor: status.color }]} />
                </View>
                <Text style={styles.progressTxt}>{Math.round(progress)}%</Text>
            </View>
        </TouchableOpacity>
    );
}

function PaymentDetailModal({ event, visible, onClose }: any) {
    if (!event) return null;
    const remaining = event.totalAmount - event.paidAmount;

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <LinearGradient colors={['#1E3A5F', '#0F2027']} style={styles.modalContent}>
                    <View style={styles.modalHandle} />
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Payment Split</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalScroll}>
                        <View style={styles.mSection}>
                            <DetailItem label="Event Name" value={event.name} />
                            <DetailItem label="Full Date" value={event.date + ' • ' + event.time} />
                            <DetailItem label="Location" value={event.location} />
                        </View>

                        <View style={styles.breakdownCard}>
                            <View style={styles.bRow}>
                                <Text style={styles.bLabel}>Standard Cost</Text>
                                <Text style={styles.bValue}>₹{event.totalAmount - event.advance}</Text>
                            </View>
                            <View style={styles.bRow}>
                                <Text style={styles.bLabel}>Advance (Booking)</Text>
                                <Text style={styles.bValue}>₹{event.advance}</Text>
                            </View>
                            <View style={[styles.bRow, { borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingTop: 10, marginTop: 5 }]}>
                                <Text style={[styles.bLabel, { color: '#FFF', fontWeight: '800' }]}>Net Payable</Text>
                                <Text style={[styles.bValue, { color: colors.primary, fontSize: 18 }]}>₹{event.totalAmount}</Text>
                            </View>
                        </View>

                        <View style={styles.statusSection}>
                            <View style={styles.statusItem}>
                                <Text style={styles.sLabel}>Paid to Date</Text>
                                <Text style={[styles.sValue, { color: colors.success }]}>₹{event.paidAmount}</Text>
                            </View>
                            <View style={styles.statusItem}>
                                <Text style={styles.sLabel}>Standing Balance</Text>
                                <Text style={[styles.sValue, { color: '#FF5252' }]}>₹{remaining}</Text>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
                        <Text style={styles.doneBtnText}>Close Report</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </Modal>
    );
}

function DetailItem({ label, value }: any) {
    return (
        <View style={styles.dItem}>
            <Text style={styles.dLabel}>{label}</Text>
            <Text style={styles.dValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 25,
        paddingBottom: 20,
    },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFF' },
    headerSubtitle: { fontSize: 14, color: colors.primary, fontWeight: '700', textTransform: 'uppercase', marginTop: 4 },
    profileBtn: { width: 44, height: 44, borderRadius: 12, overflow: 'hidden' },
    profileGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    profileInitial: { color: '#1E3A5F', fontWeight: '900', fontSize: 18 },
    summaryGrid: { flexDirection: 'row', gap: 15, paddingHorizontal: 25, marginBottom: 20 },
    summaryCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.12)' },
    summaryLabel: { fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', fontWeight: '800', textTransform: 'uppercase', marginBottom: 5 },
    summaryValue: { fontSize: 18, fontWeight: '800' },
    tabBar: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.05)', marginHorizontal: 25, borderRadius: 15, padding: 5, marginBottom: 20 },
    tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    activeTabItem: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    tabText: { color: 'rgba(255,255,255,0.4)', fontWeight: '700' },
    activeTabText: { color: colors.primary },
    filterBar: { marginBottom: 20 },
    filterBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginRight: 10, backgroundColor: 'rgba(255,255,255,0.05)' },
    filterBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '700' },
    activeFilterTxt: { color: '#1E3A5F' },
    scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
    card: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    cardTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
    cardDate: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
    statusLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    amountArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 15, marginBottom: 15 },
    amtBox: { alignItems: 'center' },
    amtLabel: { fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: '800', marginBottom: 4 },
    amtValue: { fontSize: 15, fontWeight: '800' },
    progressBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    barContainer: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 3 },
    progressTxt: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.4)', width: 35 },
    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: 'rgba(255,255,255,0.2)', marginTop: 15, fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '85%' },
    modalHandle: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    modalTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
    modalScroll: { marginBottom: 20 },
    mSection: { marginBottom: 25 },
    dItem: { marginBottom: 15 },
    dLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
    dValue: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    breakdownCard: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 20, marginBottom: 25 },
    bRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    bLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
    bValue: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    statusSection: { flexDirection: 'row', gap: 15 },
    statusItem: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 15, alignItems: 'center' },
    sLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 5 },
    sValue: { fontSize: 16, fontWeight: '900' },
    doneBtn: { backgroundColor: colors.primary, padding: 18, borderRadius: 20, alignItems: 'center' },
    doneBtnText: { color: '#1E3A5F', fontWeight: '900', fontSize: 16 },
    divider: { backgroundColor: 'rgba(255,255,255,0.1)' }
});
