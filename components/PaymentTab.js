import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { api } from '../services/api';
import BottomTabBar from './BottomTabBar';

const { width } = Dimensions.get('window');

const FILTERS = ['All', 'Paid', 'Partial', 'Pending'];

const PaymentTab = ({ onNavigate }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [payModal, setPayModal] = useState(null); // event object
  const [payingId, setPayingId] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.getEvents();
      if (res.success) {
        setEvents(res.events || []);
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      }
    } catch (err) {
      console.error('PaymentTab fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const onRefresh = () => { setRefreshing(true); fetchEvents(); };

  // ── Derived stats ──────────────────────────────────────────────
  const totalBookings = events.length;

  const advanceCollected = events.reduce((sum, e) => {
    const adv = parseFloat(e.advancePaid) || 0;
    return sum + adv;
  }, 0);

  const fullyPaid = events.filter(e => {
    const total = parseFloat(e.totalCost) || 0;
    const adv   = parseFloat(e.advancePaid) || 0;
    return total > 0 && adv >= total;
  }).length;

  const pendingTotal = events.reduce((sum, e) => {
    const total   = parseFloat(e.totalCost) || 0;
    const adv     = parseFloat(e.advancePaid) || 0;
    const balance = total - adv;
    return balance > 0 ? sum + balance : sum;
  }, 0);

  // ── Payment status helper ──────────────────────────────────────
  const getPayStatus = (event) => {
    const total   = parseFloat(event.totalCost) || 0;
    const advance = parseFloat(event.advancePaid) || 0;
    if (advance <= 0) return 'Pending';
    if (advance >= total) return 'Paid';
    return 'Partial';
  };

  const STATUS_COLORS = {
    Paid:    { bg: '#E8F5E9', text: '#2E7D32', dot: '#4CAF50' },
    Partial: { bg: '#FFF3E0', text: '#E65100', dot: '#FF9800' },
    Pending: { bg: '#FFEBEE', text: '#C62828', dot: '#F44336' },
  };

  // ── Filtered list ──────────────────────────────────────────────
  const filteredEvents = events.filter(e => {
    if (activeFilter === 'All') return true;
    return getPayStatus(e) === activeFilter;
  });

  // ── Pay balance (simulate / prod) ──────────────────────────────
  const handlePayBalance = async (event) => {
    const total   = parseFloat(event.totalCost) || 0;
    const advance = parseFloat(event.advancePaid) || 0;
    const balance = total - advance;
    if (balance <= 0) { Alert.alert('Already Paid', 'This event is fully paid.'); return; }

    setPayingId(event.id);
    setPayModal(null);
    try {
      // In prod: open Razorpay with balance amount
      // Here we simulate success (same pattern as PaymentReview)
      const mockPayload = {
        razorpay_order_id:  'test_order_' + Date.now(),
        razorpay_payment_id:'test_pay_'   + Date.now(),
        razorpay_signature: 'test_sig_manual',
        isTest:   true,
        eventData: {
          name:        event.name,
          type:        event.type,
          location:    event.location,
          inDate:      event.inDate,
          inTime:      event.inTime,
          outDate:     event.outDate,
          outTime:     event.outTime,
          suppliers:   parseInt(event.suppliers)   || 0,
          dressCode:   event.dressCode,
          services:    event.services || [],
          costPerHead: parseFloat(event.costPerHead) || 0,
          totalCost:   total,
          advancePaid: total, // now fully paid
        }
      };
      const verifyRes = await api.verifyPayment(mockPayload);
      if (verifyRes.success) {
        Alert.alert('✅ Payment Successful', `Balance ₹${balance.toLocaleString()} paid for ${event.name}`);
        fetchEvents();
      } else {
        throw new Error(verifyRes.message || 'Verification failed');
      }
    } catch (err) {
      Alert.alert('Payment Error', err.message);
    } finally {
      setPayingId(null);
    }
  };

  // ── Summary card ───────────────────────────────────────────────
  const SummaryCard = ({ icon, iconLib, label, value, gradient, iconColor }) => (
    <LinearGradient colors={gradient} style={styles.summaryCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={[styles.summaryIconWrap, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
        {iconLib === 'mc'
          ? <MaterialCommunityIcons name={icon} size={20} color={iconColor || '#FFF'} />
          : <Ionicons name={icon} size={20} color={iconColor || '#FFF'} />
        }
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </LinearGradient>
  );

  // ── Booking card ───────────────────────────────────────────────
  const BookingCard = ({ event }) => {
    const total   = parseFloat(event.totalCost) || 0;
    const advance = parseFloat(event.advancePaid) || 0;
    const balance = Math.max(0, total - advance);
    const status  = getPayStatus(event);
    const clr     = STATUS_COLORS[status];
    const pct     = total > 0 ? Math.min((advance / total) * 100, 100) : 0;
    const isPaying = payingId === event.id;

    const eventDate = event.inDate || event.date || '—';
    const icon = event.type === 'wedding' ? 'ring' :
                 event.type === 'corporate' ? 'briefcase-outline' : 'party-popper';

    return (
      <View style={styles.bookingCard}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.typeIcon, { backgroundColor: '#FFF9E6' }]}>
              <MaterialCommunityIcons name={icon} size={18} color="#7B3F00" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardEventName} numberOfLines={1}>{event.name || 'Unnamed Event'}</Text>
              <View style={styles.cardDateRow}>
                <Ionicons name="calendar-outline" size={12} color="#999" />
                <Text style={styles.cardDateText}>  Event Date: {eventDate}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: clr.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: clr.dot }]} />
              <Text style={[styles.statusText, { color: clr.text }]}>{status === 'Paid' ? 'Fully Paid' : status === 'Partial' ? 'Partial Payment' : 'Pending'}</Text>
            </View>
          </View>
        </View>

        {/* Amount Breakdown */}
        <View style={styles.amountGrid}>
          <AmountRow label="Total Amount"   value={`₹${total.toLocaleString()}`}   bold />
          <AmountRow label="Advance Paid"   value={`₹${advance.toLocaleString()}`} color="#4CAF50" />
          <AmountRow label="Balance Amount" value={`₹${balance.toLocaleString()}`} color={balance > 0 ? '#F44336' : '#4CAF50'} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <LinearGradient
              colors={status === 'Paid' ? ['#4CAF50', '#81C784'] : status === 'Partial' ? ['#FF9800', '#FFB74D'] : ['#F44336', '#EF9A9A']}
              style={[styles.progressFill, { width: `${pct}%` }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.progressPct}>{Math.round(pct)}% paid</Text>
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          {balance > 0 && (
            <TouchableOpacity
              style={styles.actionPayBtn}
              onPress={() => setPayModal(event)}
              disabled={isPaying}
            >
              <LinearGradient colors={['#7B3F00', '#4A2600']} style={styles.actionPayGrad}>
                {isPaying
                  ? <ActivityIndicator color="#FFF" size="small" />
                  : <>
                      <Ionicons name="wallet-outline" size={14} color="#FFF" />
                      <Text style={styles.actionPayText}>Pay Balance</Text>
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionOutlineBtn}
            onPress={() => Alert.alert('Details', `${event.name}\nTotal: ₹${total.toLocaleString()}\nAdvance: ₹${advance.toLocaleString()}\nBalance: ₹${balance.toLocaleString()}`)}
          >
            <Ionicons name="eye-outline" size={14} color="#7B3F00" />
            <Text style={styles.actionOutlineText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionOutlineBtn}
            onPress={() => Alert.alert('Receipt', 'Receipt download coming soon!')}
          >
            <Ionicons name="download-outline" size={14} color="#555" />
            <Text style={[styles.actionOutlineText, { color: '#555' }]}>Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const AmountRow = ({ label, value, bold, color }) => (
    <View style={styles.amountRow}>
      <Text style={styles.amountLabel}>{label}</Text>
      <Text style={[styles.amountValue, bold && { fontFamily: 'Outfit_700Bold' }, color && { color }]}>{value}</Text>
    </View>
  );

  // ── Pay Balance Confirmation Modal ─────────────────────────────
  const PayBalanceModal = () => {
    if (!payModal) return null;
    const total   = parseFloat(payModal.totalCost) || 0;
    const advance = parseFloat(payModal.advancePaid) || 0;
    const balance = Math.max(0, total - advance);
    return (
      <Modal transparent visible animationType="slide" onRequestClose={() => setPayModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <LinearGradient colors={['#7B3F00', '#2C1206']} style={styles.modalHeader}>
              <Ionicons name="wallet" size={28} color="#FFD700" />
              <Text style={styles.modalTitle}>Pay Balance</Text>
              <Text style={styles.modalSub}>Settle remaining amount for this event</Text>
            </LinearGradient>

            <View style={styles.modalBody}>
              <Text style={styles.modalEventName}>{payModal.name}</Text>

              <View style={styles.modalAmountCard}>
                <View style={styles.modalRow}>
                  <Text style={styles.modalRowLabel}>Total Amount</Text>
                  <Text style={styles.modalRowValue}>₹{total.toLocaleString()}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalRowLabel}>Already Paid</Text>
                  <Text style={[styles.modalRowValue, { color: '#4CAF50' }]}>₹{advance.toLocaleString()}</Text>
                </View>
                <View style={[styles.modalRow, styles.modalRowHighlight]}>
                  <Text style={[styles.modalRowLabel, { fontFamily: 'Outfit_700Bold', color: '#2C1206' }]}>Balance Due</Text>
                  <Text style={[styles.modalRowValue, { color: '#7B3F00', fontSize: 22 }]}>₹{balance.toLocaleString()}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.modalPayBtn} onPress={() => handlePayBalance(payModal)}>
                <LinearGradient colors={['#7B3F00', '#4A2600']} style={styles.modalPayGrad}>
                  <Ionicons name="shield-checkmark" size={18} color="#FFD700" />
                  <Text style={styles.modalPayText}>Pay ₹{balance.toLocaleString()} Now</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setPayModal(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <LinearGradient colors={['#2C1206', '#5C2E00']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSub}>Overview</Text>
            <Text style={styles.headerTitle}>Payments</Text>
          </View>
          <View style={styles.headerIcon}>
            <FontAwesome5 name="rupee-sign" size={20} color="#FFD700" />
          </View>
        </View>

        {/* Summary Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryScroll}>
          <SummaryCard
            icon="wallet" label="Advance Collected"
            value={`₹${advanceCollected.toLocaleString()}`}
            gradient={['#4A90D9', '#2C5F8A']}
          />
          <SummaryCard
            icon="alert-circle" label="Pending Payments"
            value={`₹${pendingTotal.toLocaleString()}`}
            gradient={['#E65100', '#BF360C']}
          />
          <SummaryCard
            icon="checkmark-circle" label="Fully Paid"
            value={String(fullyPaid)}
            gradient={['#2E7D32', '#1B5E20']}
          />
          <SummaryCard
            icon="calendar" label="Total Bookings"
            value={String(totalBookings)}
            gradient={['#6A1B9A', '#4A148C']}
          />
        </ScrollView>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => {
          const isActive = activeFilter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, isActive && styles.filterBtnActive]}
              onPress={() => setActiveFilter(f)}
            >
              {isActive && (
                <LinearGradient colors={['#7B3F00', '#4A2600']} style={StyleSheet.absoluteFill} borderRadius={20} />
              )}
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#7B3F00" />
          <Text style={styles.loaderText}>Loading payments...</Text>
        </View>
      ) : (
        <Animated.ScrollView
          style={{ opacity: fadeAnim }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7B3F00']} />}
        >
          {filteredEvents.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="cash-remove" size={64} color="#DDD" />
              <Text style={styles.emptyTitle}>No {activeFilter === 'All' ? '' : activeFilter} payments</Text>
              <Text style={styles.emptySub}>
                {activeFilter === 'All'
                  ? 'Create your first event to track payments here.'
                  : `No bookings with "${activeFilter}" status yet.`}
              </Text>
            </View>
          ) : (
            filteredEvents.map(event => <BookingCard key={event.id} event={event} />)
          )}
        </Animated.ScrollView>
      )}

      <BottomTabBar activeTab="payment-tab" onNavigate={onNavigate} />
      <PayBalanceModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  // Header
  header: { paddingTop: 10, paddingBottom: 24, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Outfit_400Regular' },
  headerTitle: { fontSize: 26, color: '#FFF', fontFamily: 'Outfit_700Bold' },
  headerIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center' },

  // Summary Cards
  summaryScroll: { paddingRight: 10, gap: 12 },
  summaryCard: { width: 150, borderRadius: 18, padding: 16, marginRight: 0 },
  summaryIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  summaryValue: { fontSize: 20, fontFamily: 'Outfit_700Bold', color: '#FFF', marginBottom: 4 },
  summaryLabel: { fontSize: 11, fontFamily: 'Outfit_400Regular', color: 'rgba(255,255,255,0.75)', lineHeight: 14 },

  // Filters
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, gap: 10 },
  filterBtn: { flex: 1, paddingVertical: 8, borderRadius: 20, alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0', overflow: 'hidden' },
  filterBtnActive: { borderColor: 'transparent' },
  filterText: { fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: '#888' },
  filterTextActive: { color: '#FFF' },

  // Loading
  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loaderText: { fontSize: 14, fontFamily: 'Outfit_400Regular', color: '#999' },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 120, gap: 16, paddingTop: 4 },

  // Empty state
  emptyWrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontFamily: 'Outfit_700Bold', color: '#CCC', marginTop: 16, marginBottom: 8 },
  emptySub: { fontSize: 13, fontFamily: 'Outfit_400Regular', color: '#BBB', textAlign: 'center', lineHeight: 20 },

  // Booking Card
  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: { marginBottom: 14 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center' },
  typeIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardEventName: { fontSize: 16, fontFamily: 'Outfit_700Bold', color: '#2C1206', flex: 1 },
  cardDateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  cardDateText: { fontSize: 11, fontFamily: 'Outfit_400Regular', color: '#999' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontFamily: 'Outfit_700Bold' },

  // Amount Grid
  amountGrid: { backgroundColor: '#FAFAFA', borderRadius: 14, padding: 14, marginBottom: 14, gap: 8 },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amountLabel: { fontSize: 13, fontFamily: 'Outfit_400Regular', color: '#666' },
  amountValue: { fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: '#333' },

  // Progress
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  progressBg: { flex: 1, height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressPct: { fontSize: 11, fontFamily: 'Outfit_700Bold', color: '#888', minWidth: 55, textAlign: 'right' },

  // Card Actions
  cardActions: { flexDirection: 'row', gap: 8 },
  actionPayBtn: { flex: 1.2, height: 38, borderRadius: 10, overflow: 'hidden' },
  actionPayGrad: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  actionPayText: { fontSize: 12, fontFamily: 'Outfit_700Bold', color: '#FFF' },
  actionOutlineBtn: { flex: 1, height: 38, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, borderRadius: 10, borderWidth: 1.5, borderColor: '#E8DDD5', backgroundColor: '#FAFAFA' },
  actionOutlineText: { fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: '#7B3F00' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#DDD', alignSelf: 'center', marginTop: 12, marginBottom: 0 },
  modalHeader: { padding: 24, alignItems: 'center', gap: 6 },
  modalTitle: { fontSize: 22, fontFamily: 'Outfit_700Bold', color: '#FFF', marginTop: 6 },
  modalSub: { fontSize: 13, fontFamily: 'Outfit_400Regular', color: 'rgba(255,255,255,0.7)' },
  modalBody: { padding: 24, paddingBottom: 36 },
  modalEventName: { fontSize: 16, fontFamily: 'Outfit_700Bold', color: '#2C1206', marginBottom: 16, textAlign: 'center' },
  modalAmountCard: { backgroundColor: '#F8F8F8', borderRadius: 16, padding: 16, gap: 10, marginBottom: 24 },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalRowHighlight: { backgroundColor: '#FFF9E6', padding: 10, borderRadius: 10, marginTop: 4 },
  modalRowLabel: { fontSize: 14, fontFamily: 'Outfit_400Regular', color: '#666' },
  modalRowValue: { fontSize: 16, fontFamily: 'Outfit_700Bold', color: '#333' },
  modalPayBtn: { height: 54, borderRadius: 14, overflow: 'hidden', marginBottom: 12, elevation: 6, shadowColor: '#7B3F00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  modalPayGrad: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  modalPayText: { fontSize: 16, fontFamily: 'Outfit_700Bold', color: '#FFF' },
  modalCancelBtn: { alignItems: 'center', paddingVertical: 12 },
  modalCancelText: { fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: '#999' },
});

export default PaymentTab;
