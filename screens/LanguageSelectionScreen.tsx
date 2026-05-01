import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LanguageSelectionScreen() {
    const { setLanguage, navigate } = useApp();
    const [selectedLang, setSelectedLang] = useState<string | null>(null);

    // Animation values
    const scaleEn = useRef(new Animated.Value(1)).current;
    const scaleTa = useRef(new Animated.Value(1)).current;

    const animateSelection = (lang: string) => {
        // Reset both first
        Animated.spring(scaleEn, { toValue: 1, useNativeDriver: true, bounciness: 10 }).start();
        Animated.spring(scaleTa, { toValue: 1, useNativeDriver: true, bounciness: 10 }).start();

        // Animate the selected one
        if (lang === 'en') {
            Animated.spring(scaleEn, { toValue: 1.05, useNativeDriver: true, bounciness: 12 }).start();
        } else if (lang === 'ta') {
            Animated.spring(scaleTa, { toValue: 1.05, useNativeDriver: true, bounciness: 12 }).start();
        }
    };

    const handleSelect = (lang: string) => {
        setSelectedLang(lang);
        animateSelection(lang);
    };

    const handleContinue = () => {
        if (selectedLang) {
            setLanguage(selectedLang);
            navigate('Login');
        }
    };

    return (
        <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            style={styles.container}
        >
            <StatusBar style="light" />

            <View style={styles.content}>
                {/* Logo Section */}
                <Text style={styles.logo}>🎊</Text>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>Welcome to VIZHAA</Text>
                    <Text style={styles.subtitle}>Select your language to continue</Text>
                </View>

                {/* Options Container */}
                <View style={styles.optionsContainer}>
                    {/* English Card */}
                    <Animated.View style={{ transform: [{ scale: scaleEn }] }}>
                        <TouchableOpacity
                            style={[
                                styles.optionCard,
                                selectedLang === 'en' && styles.optionSelected
                            ]}
                            onPress={() => handleSelect('en')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.langInfo}>

                                <View>
                                    <Text style={styles.langTitle}>English</Text>

                                </View>
                            </View>
                            <View style={[styles.radioButton, selectedLang === 'en' && styles.radioSelected]}>
                                {selectedLang === 'en' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Tamil Card */}
                    <Animated.View style={{ transform: [{ scale: scaleTa }] }}>
                        <TouchableOpacity
                            style={[
                                styles.optionCard,
                                selectedLang === 'ta' && styles.optionSelected
                            ]}
                            onPress={() => handleSelect('ta')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.langInfo}>

                                <View>
                                    <Text style={styles.langTitle}>தமிழ்</Text>

                                </View>
                            </View>
                            <View style={[styles.radioButton, selectedLang === 'ta' && styles.radioSelected]}>
                                {selectedLang === 'ta' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Action Section */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, !selectedLang && styles.buttonDisabled]}
                        onPress={handleContinue}
                        disabled={!selectedLang}
                        activeOpacity={0.9}
                    >
                        {selectedLang ? (
                            <LinearGradient
                                colors={['#FFD700', '#FFA500']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>Continue</Text>
                            </LinearGradient>
                        ) : (
                            <View style={[styles.buttonGradient, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                                <Text style={[styles.buttonText, { color: 'rgba(255, 255, 255, 0.4)' }]}>Continue</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 80,
        paddingBottom: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        fontSize: 60,
        marginBottom: 20,
    },
    headerTextContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
    optionsContainer: {
        width: '100%',
        gap: 20,
    },
    optionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        padding: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    optionSelected: {
        borderColor: '#FFD700',
        borderWidth: 2,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    langInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    flagIcon: {
        fontSize: 28,
    },
    langTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    langSub: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 2,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: '#FFD700',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFD700',
    },
    footer: {
        width: '100%',
        marginTop: 40,
    },
    button: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        // Shadow/Glow Effect
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
    }
});
