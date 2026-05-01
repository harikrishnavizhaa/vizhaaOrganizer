import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import StatusSteps from '../components/StatusSteps';
import { MockBackend } from '../services/mockBackend';
import { colors } from '../src/theme/colors';

const { width } = Dimensions.get('window');

const DUMMY_SUPPLIERS = [
    { id: '1', name: 'John Doe', role: 'Staff' },
    { id: '2', name: 'Jane Smith', role: 'Staff' },
    { id: '3', name: 'Mike Ross', role: 'Manager' },
    { id: '4', name: 'Harvey Specter', role: 'Supervisor' },
];

export default function EventStatusScreen() {
    const { events, selectedEventId, user, navigate } = useApp();
    const event = events.find(e => e.id === selectedEventId);
    const [simulatedStatus, setSimulatedStatus] = useState(event?.status || 'upcoming');

    useEffect(() => {
        if (event) setSimulatedStatus(event.status);
    }, [event]);

    const handleSimulate = () => {
        MockBackend.simulateEventUpdates((newStatus) => {
            let statusKey = 'upcoming';
            if (newStatus === 'Supplier Assigned') statusKey = 'assigned';
            if (newStatus === 'Supplier Arrived') statusKey = 'arrived';
            if (newStatus === 'Event Started') statusKey = 'started';
            if (newStatus === 'Event Completed') statusKey = 'completed';
            setSimulatedStatus(statusKey as any);
        });
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigate('Dashboard')} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>{event?.name || 'Event Status'}</Text>
                <Text style={styles.headerSubtitle}>Live Tracking</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn} onPress={() => navigate('profile')}>
                <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.profileGradient}>
                    <Text style={styles.profileInitial}>{user?.name?.[0]?.toUpperCase() || 'H'}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderSupplierCard = ({ item }: { item: any }) => (
        <View style={styles.suppCard}>
            <View style={styles.suppLeft}>
                <View style={styles.suppAvatar}>
                    <Text style={styles.avatarText}>{item.name[0]}</Text>
                </View>
                <View style={styles.suppInfo}>
                    <Text style={styles.suppName}>{item.name}</Text>
                    <Text style={styles.suppRole}>{item.role}</Text>
                </View>
            </View>
            <View style={styles.suppActions}>
                <TouchableOpacity style={styles.suppActionBtn}>
                    <Ionicons name="call" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.suppActionBtn}>
                    <Ionicons name="chatbubble" size={18} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style="light" />
                {renderHeader()}

                <View style={styles.overviewCard}>
                    <View style={styles.overviewRow}>
                        <View style={styles.overviewItem}>
                            <Text style={styles.overviewLabel}>Staffs</Text>
                            <Text style={styles.overviewValue}>{event?.assignedPartners?.length || 5}/{event?.supplierCount || 10}</Text>
                        </View>
                        <View style={styles.overviewDivider} />
                        <View style={styles.overviewItem}>
                            <Text style={styles.overviewLabel}>Status</Text>
                            <Text style={[styles.overviewValue, { color: colors.primary }]}>{simulatedStatus.toUpperCase()}</Text>
                        </View>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Track Progress</Text>
                        <View style={styles.stepsContainer}>
                            <StatusSteps currentStatus={simulatedStatus} />
                        </View>
                        <TouchableOpacity style={styles.simulateLink} onPress={handleSimulate}>
                            <Text style={styles.simulateLinkText}>Run Status Demo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.section, { marginTop: 10 }]}>
                        <Text style={styles.sectionTitle}>Assignee List</Text>
                        {DUMMY_SUPPLIERS.map(item => (
                            <View key={item.id}>
                                {renderSupplierCard({ item })}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    backBtn: {
        padding: 5,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 15,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    headerSubtitle: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        fontWeight: '600',
    },
    profileBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
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
    },
    overviewCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        marginBottom: 20,
    },
    overviewRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    overviewItem: {
        alignItems: 'center',
    },
    overviewLabel: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    overviewValue: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
    overviewDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    section: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    sectionTitle: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 20,
    },
    stepsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 20,
        padding: 15,
    },
    simulateLink: {
        alignSelf: 'center',
        marginTop: 15,
        padding: 10,
    },
    simulateLinkText: {
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    suppCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 15,
        borderRadius: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    suppLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    suppAvatar: {
        width: 45,
        height: 45,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#FFD700',
        fontWeight: '800',
        fontSize: 18,
    },
    suppInfo: {
        justifyContent: 'center',
    },
    suppName: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    suppRole: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 12,
        marginTop: 2,
    },
    suppActions: {
        flexDirection: 'row',
        gap: 10,
    },
    suppActionBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 215, 0, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.15)',
    }
});
