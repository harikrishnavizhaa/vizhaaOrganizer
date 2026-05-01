import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';
import { navigationRef } from './navigationRef';

// Screens
import SplashScreen from '../../SplashScreen';
import LanguageSelectionScreen from '../../screens/LanguageSelectionScreen';
import LoginScreen from '../../LoginScreen';
import OTPScreen from '../../OTPScreen';
import OrganizerRegistrationScreen from '../../screens/OrganizerRegistrationScreen';
import MainLayout from '../../screens/MainLayout';
import CreateEventScreen from '../../screens/CreateEventScreen';
import EventConfirmationScreen from '../../screens/EventConfirmationScreen';
import EventStatusScreen from '../../screens/EventStatusScreen';

const Stack = createStackNavigator();

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="language_selection" component={LanguageSelectionScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Otp" component={OTPScreen} />
            <Stack.Screen name="organizer_registration" component={OrganizerRegistrationScreen} />
        </Stack.Navigator>
    );
}

function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Dashboard" component={MainLayout} />
            <Stack.Screen name="create_event" component={CreateEventScreen} />
            <Stack.Screen name="event_confirmation" component={EventConfirmationScreen} />
            <Stack.Screen name="event_status" component={EventStatusScreen} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    const { user, authLoading } = useApp();

    if (authLoading) {
        return <View style={{ flex: 1, backgroundColor: '#FBE258' }} />;
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Screen name="Auth" component={AuthStack} />
                ) : (
                    <Stack.Screen name="App" component={AppStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
