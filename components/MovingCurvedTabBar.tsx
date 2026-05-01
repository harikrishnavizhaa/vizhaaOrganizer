import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Animated, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';

const { width } = Dimensions.get('window');

// Configuration
const TAB_BAR_HEIGHT = 65;
const TABS_COUNT = 5;
const NOTCH_WIDTH = 95;
const NOTCH_DEPTH = 30;
const HORIZONTAL_PADDING = 10;

// Create the path for the notch (downward curve)
const getNotchPath = (fillColor: string) => {
    const left = 0;
    const right = NOTCH_WIDTH;
    const center = NOTCH_WIDTH / 2;
    const controlPointOffset = NOTCH_WIDTH * 0.25;

    return `
        M ${left},0
        C ${left + controlPointOffset},0 ${left + controlPointOffset},${NOTCH_DEPTH * 0.8} ${center},${NOTCH_DEPTH}
        C ${right - controlPointOffset},${NOTCH_DEPTH * 0.8} ${right - controlPointOffset},0 ${right},0
        L ${right},${TAB_BAR_HEIGHT}
        L ${left},${TAB_BAR_HEIGHT}
        Z
    `;
};

export type TabType = 'history' | 'profile' | 'my_event' | 'status' | 'payment';

interface TabItem {
    name: string;
    type: TabType;
    icon: string;
    iconFamily: 'Ionicons' | 'MaterialCommunityIcons';
}

const TABS: TabItem[] = [
    { name: 'Profile', type: 'profile', icon: 'person-outline', iconFamily: 'Ionicons' },
    { name: 'Status', type: 'status', icon: 'analytics-outline', iconFamily: 'Ionicons' },
    { name: 'Events', type: 'my_event', icon: 'calendar-outline', iconFamily: 'Ionicons' },
    { name: 'Payments', type: 'payment', icon: 'wallet-outline', iconFamily: 'Ionicons' },
    { name: 'History', type: 'history', icon: 'time-outline', iconFamily: 'Ionicons' },
];

interface MovingCurvedTabBarProps {
    activeTab: TabType;
    onTabPress: (tab: TabType) => void;
}

export default function MovingCurvedTabBar({ activeTab, onTabPress }: MovingCurvedTabBarProps) {
    const activeIndex = TABS.findIndex(t => t.type === activeTab);
    const animatedValue = useRef(new Animated.Value(activeIndex)).current;

    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: activeIndex,
            useNativeDriver: false,
            friction: 8,
            tension: 50
        }).start();
    }, [activeIndex]);

    const availableWidth = width - (HORIZONTAL_PADDING * 2);
    const tabWidth = availableWidth / TABS_COUNT;

    const leftSpacerWidth = animatedValue.interpolate({
        inputRange: [0, 1, 2, 3, 4],
        outputRange: TABS.map((_, i) => {
            const tabCenter = HORIZONTAL_PADDING + (i * tabWidth) + (tabWidth / 2);
            return tabCenter - (NOTCH_WIDTH / 2);
        })
    });

    const barBg = '#1E3A5F'; // Deep Blue for consistent contrast

    return (
        <View style={styles.container}>
            <View style={[StyleSheet.absoluteFill, { flexDirection: 'row' }]}>
                <Animated.View style={{
                    height: TAB_BAR_HEIGHT,
                    backgroundColor: barBg,
                    width: leftSpacerWidth,
                    borderTopLeftRadius: 0,
                }} />

                <View style={{ width: NOTCH_WIDTH, height: TAB_BAR_HEIGHT }}>
                    <Svg width={NOTCH_WIDTH} height={TAB_BAR_HEIGHT}>
                        <Path d={getNotchPath(barBg)} fill={barBg} />
                    </Svg>
                </View>

                <View style={{
                    flex: 1,
                    height: TAB_BAR_HEIGHT,
                    backgroundColor: barBg,
                    borderTopRightRadius: 0,
                }} />
            </View>

            <Animated.View style={[
                styles.floatingCircle,
                {
                    left: animatedValue.interpolate({
                        inputRange: [0, 1, 2, 3, 4],
                        outputRange: TABS.map((_, i) => {
                            const tabCenter = HORIZONTAL_PADDING + (i * tabWidth) + (tabWidth / 2);
                            return tabCenter - 30; // 60/2
                        })
                    })
                }
            ]}>
                <View style={styles.circleInner}>
                    {activeIndex >= 0 && (
                        TABS[activeIndex].iconFamily === 'Ionicons' ? (
                            <Ionicons name={TABS[activeIndex].icon.replace('-outline', '') as any} size={28} color="#1E3A5F" />
                        ) : (
                            <MaterialCommunityIcons name={TABS[activeIndex].icon as any} size={28} color="#1E3A5F" />
                        )
                    )}
                </View>
            </Animated.View>

            <View style={styles.tabsContainer}>
                {TABS.map((tab, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <TouchableOpacity
                            key={tab.type}
                            style={[styles.tabButton, { width: tabWidth }]}
                            onPress={() => onTabPress(tab.type)}
                            activeOpacity={1}
                        >
                            {!isActive && (
                                <View style={styles.iconContainer}>
                                    <Ionicons name={tab.icon as any} size={24} color="rgba(255, 255, 255, 0.4)" />
                                </View>
                            )}
                            <Text style={[
                                styles.tabLabel,
                                {
                                    color: isActive ? colors.primary : 'rgba(255, 255, 255, 0.4)',
                                    fontWeight: isActive ? '800' : '600',
                                    marginTop: isActive ? 32 : 4
                                }
                            ]}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: TAB_BAR_HEIGHT,
        width: width,
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'transparent',
    },
    floatingCircle: {
        position: 'absolute',
        top: -30,
        width: 60,
        height: 60,
        borderRadius: 20, // Squircle for premium feel
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 100,
        transform: [{ rotate: '45deg' }], // Diamond shape
    },
    circleInner: {
        transform: [{ rotate: '-45deg' }], // Un-rotate icon
    },
    tabsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: HORIZONTAL_PADDING,
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: TAB_BAR_HEIGHT,
    },
    iconContainer: {
        marginBottom: 2,
    },
    tabLabel: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    }
});