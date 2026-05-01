import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme/colors';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const { user, setUser, navigate } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(user);

    const handleSave = () => {
        if (editedUser) {
            setUser(editedUser);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated!');
        }
    };

    const handleCancel = () => {
        setEditedUser(user);
        setIsEditing(false);
    };

    const updateField = (field: string, value: any) => {
        setEditedUser(prev => prev ? { ...prev, [field]: value } : null);
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>User not found</Text>
            </View>
        );
    }

    const displayUser = isEditing ? editedUser : user;

    return (
        <LinearGradient
            colors={['#0F2027', '#203A43', '#2C5364']}
            style={styles.container}
        >
            <StatusBar style="light" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigate('Dashboard')} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity
                    onPress={() => isEditing ? handleSave() : setIsEditing(true)}
                    style={styles.headerActionBtn}
                >
                    <Text style={styles.headerActionText}>{isEditing ? 'Save' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.avatarGradient}>
                            <Text style={styles.avatarLabel}>{displayUser?.name?.[0]?.toUpperCase() || 'U'}</Text>
                        </LinearGradient>
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Ionicons name="camera" size={16} color="#1E3A5F" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{displayUser?.name || 'User'}</Text>
                    <Text style={styles.userRole}>{displayUser?.category || 'Event Organizer'}</Text>
                </View>

                {isEditing && (
                    <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                        <Text style={styles.cancelBtnText}>Discard Changes</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Details</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.iconBox}>
                                <Ionicons name="person-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Full Name</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.input}
                                        value={editedUser?.name}
                                        onChangeText={t => updateField('name', t)}
                                    />
                                ) : (
                                    <Text style={styles.infoValue}>{user.name}</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={styles.iconBox}>
                                <Ionicons name="call-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Phone Number</Text>
                                <Text style={styles.infoValue}>{user.phone}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={styles.iconBox}>
                                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Date of Birth</Text>
                                {isEditing ? (
                                    <TextInput
                                        style={styles.input}
                                        value={editedUser?.dob}
                                        onChangeText={t => updateField('dob', t)}
                                    />
                                ) : (
                                    <Text style={styles.infoValue}>{user.dob || 'Not set'}</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <View style={styles.infoCard}>
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="notifications-outline" size={22} color="rgba(255, 255, 255, 0.6)" />
                            <Text style={styles.menuText}>Notifications</Text>
                            <Ionicons name="chevron-forward" size={18} color="rgba(255, 255, 255, 0.3)" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.menuItem}>
                            <Ionicons name="shield-checkmark-outline" size={22} color="rgba(255, 255, 255, 0.6)" />
                            <Text style={styles.menuText}>Security</Text>
                            <Ionicons name="chevron-forward" size={18} color="rgba(255, 255, 255, 0.3)" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigate('language_selection')}>
                            <Ionicons name="language-outline" size={22} color="rgba(255, 255, 255, 0.6)" />
                            <Text style={styles.menuText}>Language</Text>
                            <Ionicons name="chevron-forward" size={18} color="rgba(255, 255, 255, 0.3)" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => Alert.alert('Logout', 'Are you sure?', [
                        { text: 'Cancel' },
                        { text: 'Log Out', onPress: () => navigate('Login') }
                    ])}
                >
                    <Ionicons name="log-out-outline" size={24} color="#FF5252" />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
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
        marginTop: 40,
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerActionBtn: {
        padding: 5,
    },
    headerActionText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '800',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarLabel: {
        fontSize: 40,
        fontWeight: '900',
        color: '#1E3A5F',
    },
    cameraBtn: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: '#FFD700',
        width: 30,
        height: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#203A43',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFF',
    },
    userRole: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    cancelBtn: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    cancelBtnText: {
        color: '#FF5252',
        fontWeight: '700',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 15,
        marginLeft: 10,
    },
    infoCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '700',
        marginTop: 2,
    },
    input: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '700',
        borderBottomWidth: 1,
        borderBottomColor: colors.primary,
        paddingVertical: 2,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginVertical: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#FFF',
        fontWeight: '600',
        marginLeft: 15,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        padding: 18,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 82, 82, 0.2)',
        marginTop: 10,
    },
    logoutText: {
        color: '#FF5252',
        fontSize: 16,
        fontWeight: '800',
        marginLeft: 10,
    },
    versionText: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.2)',
        fontSize: 12,
        marginTop: 30,
    },
    errorText: {
        color: '#FFF',
        textAlign: 'center',
        marginTop: 100,
    }
});
