import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../components/CustomInput';
import { useApp } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { createEvent } from '../src/api/event';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CreateEventScreen() {
    const { navigate, user, setTempEventData, showToast } = useApp();

    const [name, setName] = useState('');
    const [type, setType] = useState('Wedding');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dateFormatted, setDateFormatted] = useState('');
    const [timeFormatted, setTimeFormatted] = useState('');

    const [supplierCount, setSupplierCount] = useState('1');
    const [dressCode, setDressCode] = useState('White Shirt');

    const SERVICES_LIST = ['Breakfast', 'Lunch', 'Dinner', 'Minification', 'Snacks'];
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const [totalAmount, setTotalAmount] = useState(0);
    const SERVICE_PRICE = 500;

    useEffect(() => {
        const servicesCost = selectedServices.length * SERVICE_PRICE;
        const count = parseInt(supplierCount) || 0;
        const total = servicesCost * count;
        setTotalAmount(total);
    }, [selectedServices, supplierCount]);

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setDateFormatted(selectedDate.toLocaleDateString());
        }
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setDate(selectedTime);
            setTimeFormatted(selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
    };

    const toggleService = (service: string) => {
        if (selectedServices.includes(service)) {
            setSelectedServices(selectedServices.filter(s => s !== service));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const handleCreate = async () => {
        if (!name || !location || !dateFormatted || !timeFormatted) {
            Alert.alert('Missing Info', 'Please fill in all details.');
            return;
        }

        const newEventData = {
            name: name,
            eventType: type,
            date: date.toISOString(),
            startTime: timeFormatted,
            endTime: timeFormatted, // Placeholder
            address: location,
            latitude: 0,
            longitude: 0,
            city: 'Unknown',
            state: 'Unknown',
            pincode: '123456',
            services: selectedServices,
            dressCode: dressCode,
            totalAmount: totalAmount,
            advanceAmount: totalAmount * 0.25,
        };

        setLoading(true);
        try {
            const res = await createEvent(newEventData);
            setLoading(false);
            showToast('Event created successfully!', 'success');
            setTempEventData({ ...newEventData, id: res.data?.id || res.data?.data?.id || Date.now().toString() });
            navigate('event_confirmation');
        } catch (err: any) {
            setLoading(false);
            const errorMsg = err.response?.data?.message || 'Failed to create request.';
            Alert.alert("Error", errorMsg);
        }
    };

    return (
        <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style="light" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigate('Dashboard')} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Event</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Basic Info */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Basic Information</Text>
                        <CustomInput
                            label="Event Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g. Grand Wedding"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            style={styles.inputStyle}
                        />

                        <Text style={styles.label}>Event Type</Text>
                        <View style={styles.chipsContainer}>
                            {['Wedding', 'Corporate', 'Birthday', 'Other'].map(t => (
                                <TouchableOpacity
                                    key={t}
                                    style={[styles.chip, type === t && styles.chipActive]}
                                    onPress={() => setType(t)}
                                >
                                    <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <CustomInput
                            label="Location"
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Venue Address"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            style={styles.inputStyle}
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={styles.label}>Date</Text>
                                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
                                    <Text style={[styles.pickerText, !dateFormatted && { color: "rgba(255,255,255,0.3)" }]}>
                                        {dateFormatted || 'Select Date'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Time</Text>
                                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
                                    <Text style={[styles.pickerText, !timeFormatted && { color: "rgba(255,255,255,0.3)" }]}>
                                        {timeFormatted || 'Select Time'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Requirements */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Requirements</Text>
                        <CustomInput
                            label="Number of Staffs"
                            value={supplierCount}
                            onChangeText={setSupplierCount}
                            keyboardType="numeric"
                            placeholder="10"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            style={styles.inputStyle}
                        />

                        <Text style={styles.label}>Dress Code</Text>
                        <View style={styles.chipsContainer}>
                            {['White Shirt', 'Black Shirt', 'Uniform'].map(code => (
                                <TouchableOpacity
                                    key={code}
                                    style={[styles.chip, dressCode === code && styles.chipActive]}
                                    onPress={() => setDressCode(code)}
                                >
                                    <Text style={[styles.chipText, dressCode === code && styles.chipTextActive]}>{code}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Services Required</Text>
                        <View style={styles.chipsContainer}>
                            {SERVICES_LIST.map(service => (
                                <TouchableOpacity
                                    key={service}
                                    style={[styles.chip, selectedServices.includes(service) && styles.chipActiveService]}
                                    onPress={() => toggleService(service)}
                                >
                                    <Text style={[styles.chipText, selectedServices.includes(service) && styles.chipTextActive]}>{service}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Summary */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Payment Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Estimated Total</Text>
                            <Text style={styles.summaryValue}>₹{totalAmount}</Text>
                        </View>
                        <View style={styles.advanceBox}>
                            <Text style={styles.advanceLabel}>Advance to Pay (25%)</Text>
                            <Text style={styles.advanceAmount}>₹{(totalAmount * 0.25).toFixed(0)}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={handleCreate}
                        disabled={loading}
                        activeOpacity={0.9}
                    >
                        {loading ? (
                            <ActivityIndicator color="#1E3A5F" />
                        ) : (
                            <LinearGradient
                                colors={['#FFD700', '#FFA500']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.btnGradient}
                            >
                                <Text style={styles.submitBtnText}>Submit & Pay Advance</Text>
                            </LinearGradient>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>

            {showDatePicker && (
                <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} minimumDate={new Date()} />
            )}
            {showTimePicker && (
                <DateTimePicker value={date} mode="time" display="default" onChange={onTimeChange} />
            )}
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
    },
    backBtn: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFD700',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 215, 0, 0.2)',
        paddingBottom: 8,
    },
    label: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    inputStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        color: '#FFF',
        borderRadius: 12,
        marginBottom: 20,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        gap: 8,
    },
    chip: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    chipActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderColor: '#FFD700',
        borderWidth: 2,
    },
    chipActiveService: {
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        borderColor: '#FFA500',
        borderWidth: 2,
    },
    chipText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        fontWeight: '600',
    },
    chipTextActive: {
        color: '#FFD700',
        fontWeight: '800',
    },
    row: {
        flexDirection: 'row',
    },
    pickerButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 15,
        height: 50,
        justifyContent: 'center',
        marginBottom: 20,
    },
    pickerText: {
        fontSize: 16,
        color: '#FFF',
    },
    summaryCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 15,
        textTransform: 'uppercase',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    summaryLabel: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
    },
    advanceBox: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.2)',
    },
    advanceLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFD700',
        textTransform: 'uppercase',
    },
    advanceAmount: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFD700',
    },
    submitBtn: {
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
    },
    btnGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    submitBtnText: {
        color: '#1E3A5F',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
