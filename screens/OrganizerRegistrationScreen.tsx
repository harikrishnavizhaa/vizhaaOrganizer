import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../components/CustomInput';
import { useApp } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function OrganizerRegistrationScreen() {
    const { setUser, tempPhone } = useApp();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [category, setCategory] = useState<'Organizer' | 'Manager'>('Organizer');

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = selectedDate.getDate().toString().padStart(2, '0') + '/' +
                (selectedDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
                selectedDate.getFullYear();
            setDob(formattedDate);
        }
    };

    const handleSubmit = () => {
        if (!name || !username || !password || !dob) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        const userData = {
            name,
            username,
            password,
            dob,
            gender,
            category,
            phone: tempPhone,
            role: 'organizer' as const
        };

        setUser(userData);
    };

    return (
        <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style="light" />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <Text style={styles.logo}>📝</Text>
                            <Text style={styles.title}>Registration</Text>
                            <Text style={styles.subtitle}>Complete your profile to get started</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <View style={styles.card}>
                                <Text style={styles.sectionTitle}>Profile Details</Text>
                                <CustomInput
                                    label="Full Name"
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="e.g. John Doe"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    style={styles.input}
                                />

                                <Text style={styles.label}>Date of Birth</Text>
                                <TouchableOpacity
                                    style={styles.dateInput}
                                    onPress={() => setShowPicker(true)}
                                >
                                    <Text style={[styles.dateText, !dob && { color: 'rgba(255,255,255,0.3)' }]}>
                                        {dob || "DD/MM/YYYY"}
                                    </Text>
                                </TouchableOpacity>

                                {showPicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateChange}
                                        maximumDate={new Date()}
                                    />
                                )}

                                <Text style={styles.label}>Gender</Text>
                                <View style={styles.selectionRow}>
                                    {['Male', 'Female', 'Other'].map((g) => (
                                        <TouchableOpacity
                                            key={g}
                                            style={[styles.selectionBtn, gender === g && styles.selectionBtnActive]}
                                            onPress={() => setGender(g as any)}
                                        >
                                            <Text style={[styles.selectionText, gender === g && styles.selectionTextActive]}>{g}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.card}>
                                <Text style={styles.sectionTitle}>Account Setup</Text>
                                <CustomInput
                                    label="Username"
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder="Choose a username"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    style={styles.input}
                                />
                                <CustomInput
                                    label="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="******"
                                    secureTextEntry
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    style={styles.input}
                                />
                            </View>

                            <View style={styles.card}>
                                <Text style={styles.sectionTitle}>Professional Role</Text>
                                <View style={styles.selectionRow}>
                                    <TouchableOpacity
                                        style={[styles.selectionBtn, category === 'Organizer' && styles.selectionBtnActive]}
                                        onPress={() => setCategory('Organizer')}
                                    >
                                        <Text style={[styles.selectionText, category === 'Organizer' && styles.selectionTextActive]}>Event Organizer</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.selectionBtn, category === 'Manager' && styles.selectionBtnActive]}
                                        onPress={() => setCategory('Manager')}
                                    >
                                        <Text style={[styles.selectionText, category === 'Manager' && styles.selectionTextActive]}>Manager</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.submitBtn}
                                onPress={handleSubmit}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={['#FFD700', '#FFA500']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.buttonText}>Complete Registration</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 25,
        paddingTop: 40,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        fontSize: 50,
        marginBottom: 10,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 8,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
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
        marginBottom: 8,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        color: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
    },
    dateInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    selectionRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 5,
    },
    selectionBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    selectionBtnActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        borderColor: '#FFD700',
        borderWidth: 2,
    },
    selectionText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '600',
    },
    selectionTextActive: {
        color: '#FFD700',
        fontWeight: '800',
    },
    submitBtn: {
        marginTop: 20,
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#1E3A5F',
        fontSize: 18,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
