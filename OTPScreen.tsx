import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Alert, ActivityIndicator, Dimensions, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApp } from './context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { verifyOtp, register } from './src/api/auth';

const { width } = Dimensions.get('window');

export default function OTPScreen() {
    const { tempPhone, navigate, setUser, showToast } = useApp();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [loading, setLoading] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [name, setName] = useState('');
    const [registrationLoading, setRegistrationLoading] = useState(false);

    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const res = await verifyOtp(tempPhone, otpValue);

            if (res.data && res.data.token) {
                if (res.data.user) {
                    await AsyncStorage.setItem("token", res.data.token);
                    setUser(res.data.user);
                    showToast('Login Successful!', 'success');
                } else {
                    // New user logic - collect name instead of jumping to reg screen
                    setIsNewUser(true);
                    setLoading(false);
                }
            }
        } catch (err: any) {
            setLoading(false);
            const errorMsg = err.response?.data?.message || 'Verification failed. Please check your OTP.';
            Alert.alert("Error", errorMsg);
            showToast(errorMsg, 'error');
        }
    };
    const handleRegister = async () => {
        if (!name.trim()) {
            Alert.alert('Missing Info', 'Please enter your name');
            return;
        }

        setRegistrationLoading(true);
        try {
            const res = await register({
                phone: tempPhone,
                name: name.trim(),
                role: 'ORGANIZER'
            });

            if (res.data && res.data.status === 'success') {
                showToast('Registration Successful!', 'success');
                setUser(res.data.data); // Backend returns the full user object
                // The token is already in storage or will be handled by context 
            }
        } catch (err: any) {
            setRegistrationLoading(false);
            const errorMsg = err.response?.data?.message || 'Registration failed.';
            Alert.alert("Error", errorMsg);
        }
    };

    const isOtpComplete = otp.join('').length === 6;

    return (
        <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style="light" />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.content}>
                        {!isNewUser ? (
                            <>
                                <View style={styles.header}>
                                    <Text style={styles.logo}>🔒</Text>
                                    <Text style={styles.title}>Verification</Text>
                                    <Text style={styles.subtitle}>Enter the code sent to</Text>
                                    <Text style={styles.phoneText}>+91 {tempPhone}</Text>
                                </View>

                                <View style={styles.otpContainer}>
                                    {otp.map((digit, index) => (
                                        <View key={index} style={[styles.otpInputWrapper, digit !== '' && styles.otpInputWrapperActive]}>
                                            <TextInput
                                                ref={(ref) => { inputRefs.current[index] = ref; }}
                                                style={styles.otpInput}
                                                keyboardType="number-pad"
                                                maxLength={1}
                                                value={digit}
                                                placeholder="-"
                                                placeholderTextColor="rgba(255, 255, 255, 0.2)"
                                                onChangeText={(text) => handleChange(text, index)}
                                                onKeyPress={(e) => handleKeyPress(e, index)}
                                                selectTextOnFocus
                                            />
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.footer}>
                                    <Text style={styles.timerText}>
                                        {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive code?"}
                                    </Text>
                                    {timer === 0 && (
                                        <TouchableOpacity>
                                            <Text style={styles.resendBtn}>Resend Now</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, (!isOtpComplete || loading) && styles.buttonDisabled]}
                                    onPress={handleVerify}
                                    disabled={loading || !isOtpComplete}
                                    activeOpacity={0.9}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#1E3A5F" />
                                    ) : (
                                        <LinearGradient
                                            colors={isOtpComplete ? ['#FFD700', '#FFA500'] : ['#555', '#444']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.buttonGradient}
                                        >
                                            <Text style={[styles.buttonText, !isOtpComplete && { color: '#888' }]}>Verify & Continue</Text>
                                        </LinearGradient>
                                    )}
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.registrationCard}>
                                <View style={styles.header}>
                                    <Text style={styles.logo}>👤</Text>
                                    <Text style={styles.title}>Welcome</Text>
                                    <Text style={styles.subtitle}>Tell us your name to get started</Text>
                                </View>

                                <View style={styles.inputCard}>
                                    <Text style={styles.inputLabel}>Full Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your name"
                                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                                        value={name}
                                        onChangeText={setName}
                                        onSubmitEditing={handleRegister}
                                        autoFocus
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, (!name || registrationLoading) && styles.buttonDisabled]}
                                    onPress={handleRegister}
                                    disabled={registrationLoading || !name.trim()}
                                    activeOpacity={0.9}
                                >
                                    {registrationLoading ? (
                                        <ActivityIndicator color="#1E3A5F" />
                                    ) : (
                                        <LinearGradient
                                            colors={name.trim() ? ['#FFD700', '#FFA500'] : ['#555', '#444']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.buttonGradient}
                                        >
                                            <Text style={[styles.buttonText, !name.trim() && { color: '#888' }]}>Get Started</Text>
                                        </LinearGradient>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        fontSize: 60,
        marginBottom: 20,
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
        marginTop: 12,
        textAlign: 'center',
    },
    phoneText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700',
        marginTop: 5,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 40,
    },
    otpInputWrapper: {
        width: (width - 100) / 6,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpInputWrapperActive: {
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderWidth: 2,
    },
    otpInput: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    footer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    timerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    resendBtn: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
        marginTop: 10,
    },
    button: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonDisabled: {
        shadowOpacity: 0,
        elevation: 0,
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
    },
    registrationCard: {
        flex: 1,
        justifyContent: 'center',
    },
    inputCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        padding: 22,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        marginBottom: 30,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
