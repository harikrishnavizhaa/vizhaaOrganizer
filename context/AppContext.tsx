import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { navigationRef } from '../src/navigation/navigationRef';
import Toast from '../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'organizer' | 'partner' | 'manager';

export interface User {
    name: string;
    phone: string;
    role: UserRole;
    username?: string;
    password?: string;
    dob?: string;
    gender?: string;
    category?: string;
    profilePicture?: string;
    organizerType?: string;
    age?: number;
    location?: string;
    email?: string;
    bio?: string;
}

export interface Request {
    id: string;
    userId: string;
    eventId: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp: number;
}

export interface Event {
    id: string;
    organizerId: string;
    name: string;
    type: string;
    location: string;
    date: string;
    time: string;
    supplierCount: number;
    dressCode: string;
    services: string[];
    totalAmount: number;
    paidAmount: number;
    advance: number;
    status: 'upcoming' | 'assigned' | 'arrived' | 'started' | 'completed' | 'cancelled';
    assignedPartners: string[];
    paymentStatus: 'pending' | 'advance_paid' | 'paid' | 'full_paid';
    attendeeCount?: number;
    paymentMethod?: string;
    paymentDate?: string;
}

export type ScreenType =
    | 'splash'
    | 'language_selection'
    | 'Login'
    | 'Otp'
    | 'organizer_registration'
    | 'Dashboard'
    | 'create_event'
    | 'event_confirmation'
    | 'event_status'
    | 'profile'
    | 'history'
    | 'payment';

interface AppContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    authLoading: boolean;
    events: Event[];
    requests: Request[];
    addEvent: (event: Event) => void;
    addRequest: (request: Request) => void;
    bookEvent: (eventId: string, partnerId: string) => void;
    logout: () => void;
    currentScreen: ScreenType;
    navigate: (screen: ScreenType) => void;
    selectedEventId: string | null;
    setSelectedEventId: (id: string | null) => void;
    tempEventData: any;
    setTempEventData: (data: any) => void;
    tempPhone: string;
    setTempPhone: (phone: string) => void;
    language: string;
    setLanguage: (lang: string) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [language, setLanguage] = useState<string>('en');
    const [tempPhone, setTempPhone] = useState<string>('');
    const [tempEventData, setTempEventData] = useState<any>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        loadSession();
    }, []);

    const loadSession = async () => {
        try {
            const [storedUser, storedToken] = await Promise.all([
                AsyncStorage.getItem('user'),
                AsyncStorage.getItem('token')
            ]);

            if (storedUser && storedToken) {
                setUserState(JSON.parse(storedUser));
                setTokenState(storedToken);
            }
        } catch (error) {
            console.error('Error loading session:', error);
        } finally {
            setAuthLoading(false);
        }
    };

    const setUser = async (newUser: User | null) => {
        setUserState(newUser);
        if (newUser) {
            await AsyncStorage.setItem('user', JSON.stringify(newUser));
        } else {
            await AsyncStorage.removeItem('user');
        }
    };

    const setToken = async (newToken: string | null) => {
        setTokenState(newToken);
        if (newToken) {
            await AsyncStorage.setItem('token', newToken);
        } else {
            await AsyncStorage.removeItem('token');
        }
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type });
    };

    const navigate = (screen: ScreenType) => {
        setCurrentScreen(screen);
        if (navigationRef.isReady()) {
            try {
                // @ts-ignore
                navigationRef.navigate(screen);
            } catch (e) {
                console.log('Navigation failed:', e);
            }
        }
    };

    const addEvent = (event: Event) => {
        setEvents((prev) => [...prev, event]);
    };

    const addRequest = (request: Request) => {
        setRequests((prev) => [...prev, request]);
    };

    const bookEvent = (eventId: string, partnerId: string) => {
        setEvents((prev) => prev.map(e => {
            if (e.id === eventId) {
                if (e.assignedPartners.includes(partnerId)) return e;
                if (e.assignedPartners.length >= e.supplierCount) return e;
                return { ...e, assignedPartners: [...e.assignedPartners, partnerId] };
            }
            return e;
        }));
    };

    const logout = async () => {
        setUserState(null);
        setTokenState(null);
        await Promise.all([
            AsyncStorage.removeItem('user'),
            AsyncStorage.removeItem('token')
        ]);
        setCurrentScreen('Login');
    };

    return (
        <AppContext.Provider value={{
            user, setUser, token, setToken, authLoading,
            events, requests, addEvent, addRequest, bookEvent, logout,
            currentScreen, navigate, selectedEventId, setSelectedEventId,
            tempEventData, setTempEventData, tempPhone, setTempPhone,
            language, setLanguage, showToast
        }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast(null)}
                />
            )}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
