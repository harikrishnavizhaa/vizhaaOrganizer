import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

// Screens
import OrganizerHomeScreen from './OrganizerHomeScreen';
import EventStatusScreen from './EventStatusScreen';
import PaymentScreen from './PaymentScreen';
import { HistoryScreen, ProfileScreen } from './TabPlaceholders';

// Components
import MovingCurvedTabBar, { TabType } from '../components/MovingCurvedTabBar';

export default function MainLayout() {
    const [activeTab, setActiveTab] = useState<TabType>('my_event');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileScreen />;
            case 'status':
                return <EventStatusScreen />;
            case 'my_event':
                return <OrganizerHomeScreen />;
            case 'payment':
                return <PaymentScreen />;
            case 'history':
                return <HistoryScreen />;
            default:
                return <OrganizerHomeScreen />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {renderContent()}
            </View>
            <MovingCurvedTabBar
                activeTab={activeTab}
                onTabPress={setActiveTab}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F2027', // Deep Dark
    },
    content: {
        flex: 1,
        paddingBottom: 0, // Adjusted as MovingCurvedTabBar handles its own positioning
    }
});
