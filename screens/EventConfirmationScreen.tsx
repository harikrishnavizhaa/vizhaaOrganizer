import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme/colors';

const { width } = Dimensions.get('window');

export default function EventConfirmationScreen() {
    const { user, tempEventData, addEvent, navigate } = useApp();
    const [selectedPayment, setSelectedPayment] = useState<'total' | 'advance'>('advance');
    const [loading, setLoading] = useState(false);

    const data = tempEventData || {};
    const totalAmount = data.totalAmount || 0;
    const advanceAmount = data.advanceAmount || Math.round(totalAmount * 0.25);

    const handlePayPress = async () => {
        setLoading(true);
        try {
            setTimeout(() => {
                setLoading(false);
                const newEvent: any = {
                    ...data,
                    id: Math.random().toString(36).substr(2, 9),
                    status: 'upcoming',
                    paymentStatus: selectedPayment === 'total' ? 'full_paid' : 'advance_paid',
                    paidAmount: selectedPayment === 'total' ? totalAmount : advanceAmount
                };

                addEvent(newEvent);
                Alert.alert('Success', 'Event Created Successfully!', [
                    { text: 'View Dashboard', onPress: () => navigate('Dashboard') }
                ]);
            }, 1500);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Payment Failed');
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigate('create_event')} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>Review & Pay</Text>
                <Text style={styles.headerSubtitle}>Final Step</Text>
            </View>
            <View style={styles.profileBtn}>
                <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.profileGradient}>
                    <Text style={styles.profileInitial}>{user?.name?.[0]?.toUpperCase() || 'H'}</Text>
                </LinearGradient>
            </View>
        </View>
    );

    return (
        <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style="light" />
                {renderHeader()}

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Event Summary</Text>
                            <TouchableOpacity onPress={() => navigate('create_event')}>
                                <Text style={styles.editText}>Edit</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.detailsCard}>
                            <DetailRow label="Event Name" value={data.name} icon="star-outline" />
                            <DetailRow label="Location" value={data.location} icon="location-outline" />
                            <DetailRow label="Date" value={data.date} icon="calendar-outline" />
                            <DetailRow label="Time" value={data.time} icon="time-outline" />
                            <DetailRow label="Staff Count" value={data.supplierCount?.toString()} icon="people-outline" />
                            <DetailRow label="Services" value={data.services?.join(', ')} icon="gift-outline" />
                            <DetailRow label="Dress Code" value={data.dressCode} icon="shirt-outline" />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment Options</Text>

                        <TouchableOpacity
                            style={[styles.paymentOption, selectedPayment === 'total' && styles.selectedOption]}
                            onPress={() => setSelectedPayment('total')}
                        >
                            <View style={styles.optLeft}>
                                <View style={[styles.radio, selectedPayment === 'total' && styles.radioActive]}>
                                    {selectedPayment === 'total' && <View style={styles.radioDot} />}
                                </View>
                                <View style={styles.optInfo}>
                                    <Text style={styles.optLabel}>Full Payment</Text>
                                    <Text style={styles.optSub}>Pay 100% upfront</Text>
                                </View>
                            </View>
                            <Text style={styles.optAmt}>₹{totalAmount}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.paymentOption, selectedPayment === 'advance' && styles.selectedOption]}
                            onPress={() => setSelectedPayment('advance')}
                        >
                            <View style={styles.optLeft}>
                                <View style={[styles.radio, selectedPayment === 'advance' && styles.radioActive]}>
                                    {selectedPayment === 'advance' && <View style={styles.radioDot} />}
                                </View>
                                <View style={styles.optInfo}>
                                    <Text style={styles.optLabel}>Advance Payment</Text>
                                    <Text style={styles.optSub}>Book with 25% only</Text>
                                </View>
                            </View>
                            <Text style={styles.optAmt}>₹{advanceAmount}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.termsBox}>
                        <Ionicons name="information-circle-outline" size={18} color="rgba(255, 255, 255, 0.4)" />
                        <Text style={styles.termsText}>By proceeding, you agree to our Service Level Agreements and Cancellation Policy.</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.payBtn}
                        onPress={handlePayPress}
                        disabled={loading}
                    >
                        <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.payGradient}>
                            {loading ? (
                                <ActivityIndicator color="#1E3A5F" />
                            ) : (
                                <>
                                    <Text style={styles.payBtnText}>Pay & Confirm</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#1E3A5F" />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

function DetailRow({ label, value, icon }: any) {
    return (
        <View style={styles.dRow}>
            <View style={styles.dLeft}>
                <Ionicons name={icon} size={18} color="rgba(255, 255, 255, 0.3)" />
                <Text style={styles.dLabel}>{label}</Text>
            </View>
            <Text style={styles.dValue} numberOfLines={1}>{value || 'Not set'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    backBtn: { padding: 5 },
    headerInfo: { flex: 1, marginLeft: 15 },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', textTransform: 'uppercase' },
    headerSubtitle: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 12, fontWeight: '600' },
    profileBtn: { width: 36, height: 36, borderRadius: 10, overflow: 'hidden' },
    profileGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    profileInitial: { color: '#1E3A5F', fontWeight: '900' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    section: { marginBottom: 30 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 5 },
    sectionTitle: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    editText: { color: colors.primary, fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
    detailsCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
    dRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    dLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    dLabel: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, fontWeight: '600' },
    dValue: { color: '#FFF', fontSize: 14, fontWeight: '700', flex: 1, textAlign: 'right', marginLeft: 10 },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        marginBottom: 12
    },
    selectedOption: { borderColor: colors.primary, backgroundColor: 'rgba(255, 215, 0, 0.05)' },
    optLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    optInfo: { flex: 1 },
    radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center' },
    radioActive: { borderColor: colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
    optLabel: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    optSub: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 12, marginTop: 2 },
    optAmt: { color: colors.primary, fontSize: 18, fontWeight: '800' },
    termsBox: { flexDirection: 'row', gap: 10, paddingHorizontal: 10, marginBottom: 30 },
    termsText: { color: 'rgba(255, 255, 255, 0.3)', fontSize: 11, flex: 1, lineHeight: 16 },
    payBtn: { height: 60, borderRadius: 20, overflow: 'hidden', marginTop: 10 },
    payGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    payBtnText: { color: '#1E3A5F', fontSize: 18, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 }
});
