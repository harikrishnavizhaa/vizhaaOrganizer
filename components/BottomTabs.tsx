import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Constants
const TAB_BAR_HEIGHT = 70;
const BUTTON_RADIUS = 35; // Radius of the circular hole/button area
const CENTER = width / 2;

export type TabType = 'history' | 'profile' | 'my_event' | 'status' | 'payment';

interface BottomTabsProps {
    activeTab: TabType;
    onTabPress: (tab: TabType) => void;
}

// SVG Path for the curved shape
// A simple curve cutout at the center
const getPath = () => {
    // 0,0 top-left
    // we want a curve at the center of top edge.
    // Start top-left
    const start = `M0,0`;
    // Line to start of curve
    // The curve starts at CENTER - BUTTON_RADIUS * 2 (approx) or customizable
    // Let's create a smooth cubic bezier
    // Control points for bezier

    // Using a known path shape for curved tabs
    // Or we can construct it:
    // L (center - 75), 0
    // Curve down to (center, 40)
    // Curve up to (center + 75), 0
    // L width, 0
    // L width, height
    // L 0, height
    // Z

    const holeWidth = 75;
    const depth = 40;

    const path = `
        M0,0
        L${CENTER - holeWidth},0
        C${CENTER - holeWidth + 20},0 ${CENTER - holeWidth + 10},${depth} ${CENTER},${depth}
        C${CENTER + holeWidth - 10},${depth} ${CENTER + holeWidth - 20},0 ${CENTER + holeWidth},0
        L${width},0
        L${width},${TAB_BAR_HEIGHT}
        L0,${TAB_BAR_HEIGHT}
        Z
    `;
    return path;
};

const TabItem = ({
    name,
    icon,
    type,
    isActive,
    onPress,
}: {
    name: string;
    icon: (color: string) => React.ReactNode;
    type: TabType;
    isActive: boolean;
    onPress: () => void;
}) => {
    const activeColor = '#FFD700'; // Yellow
    const inactiveColor = '#fff';  // White on the dark nav bar? 
    // Wait, typical curved bars have a color fill. The previous one was white bg.
    // If I use SVG, I should pick a color. 
    // Let's use standard Navbar color or White.
    // If using White background for rect, hole will show content behind?
    // Usually curved bars color matches the bar background.
    // Previous bar was white.
    // Let's stick to White background for the bar SVG fill.
    // Then inactive icon color should be dark.

    const svgFill = '#FFFFFF';
    const textActive = '#1E3A5F';
    const textInactive = '#999';
    const iconActive = '#FFC107'; // Yellow
    const iconInactive = '#999';

    // Animation
    const scale = useRef(new Animated.Value(isActive ? 1.1 : 1)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: isActive ? 1.1 : 1,
            useNativeDriver: true,
            friction: 5
        }).start();
    }, [isActive]);

    return (
        <TouchableOpacity
            style={styles.tabItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Animated.View style={{ alignItems: 'center', transform: [{ scale }] }}>
                {icon(isActive ? iconActive : iconInactive)}
                <Text style={{
                    fontSize: 10,
                    color: isActive ? textActive : textInactive,
                    marginTop: 4,
                    fontWeight: isActive ? 'bold' : 'normal'
                }}>
                    {name}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const CenterButton = ({ onPress, isActive }: { onPress: () => void, isActive: boolean }) => {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true })
        ]).start();
    }, [isActive]); // Trigger bounce on active? Or just press?

    // We want the button to handle its own press animation too, passed on onPress

    return (
        <TouchableOpacity
            style={styles.centerButtonContainer}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <Animated.View style={[
                styles.centerButton,
                isActive && styles.centerButtonActive,
                { transform: [{ scale }] }
            ]}>
                <MaterialIcons name="event" size={28} color="#1E3A5F" />
                {/* Text inside or just icon? Previous had text below.
                    Floating buttons usually just icon.
                    But user wants "My Event".
                */}
            </Animated.View>
            <Text style={styles.centerButtonText}>My Event</Text>
        </TouchableOpacity>
    );
}


export default function BottomTabs({ activeTab, onTabPress }: BottomTabsProps) {

    return (
        <View style={styles.wrapper}>

            {/* SVG Background */}
            <View style={styles.svgContainer}>
                <Svg width={width} height={TAB_BAR_HEIGHT + 50} style={styles.svg}>
                    <Path
                        d={getPath()}
                        fill="#FFFFFF"
                        stroke="#E0E0E0"
                        strokeWidth={1}
                    // Add shadow via dropShadow if compatible or elevation on container
                    />
                </Svg>
            </View>

            {/* Tab Items Container */}
            <View style={styles.tabsContainer}>

                {/* Left Tabs */}
                <View style={styles.sideTabs}>
                    <TabItem
                        name="Profile"
                        icon={(color) => <FontAwesome5 name="user-alt" size={20} color={color} />}
                        type="profile"
                        isActive={activeTab === 'profile'}
                        onPress={() => onTabPress('profile')}
                    />
                    <TabItem
                        name="Status"
                        icon={(color) => <MaterialIcons name="assignment" size={24} color={color} />}
                        type="status"
                        isActive={activeTab === 'status'}
                        onPress={() => onTabPress('status')}
                    />
                </View>

                {/* Spacer for Center Button */}
                <View style={styles.centerSpacer} />

                {/* Right Tabs */}
                <View style={styles.sideTabs}>
                    <TabItem
                        name="Payment"
                        icon={(color) => <FontAwesome5 name="money-bill-wave" size={20} color={color} />}
                        type="payment"
                        isActive={activeTab === 'payment'}
                        onPress={() => onTabPress('payment')}
                    />
                    <TabItem
                        name="History"
                        icon={(color) => <MaterialIcons name="history" size={24} color={color} />}
                        type="history"
                        isActive={activeTab === 'history'}
                        onPress={() => onTabPress('history')}
                    />
                </View>
            </View>

            {/* Floating Center Button */}
            <CenterButton
                isActive={activeTab === 'my_event'}
                onPress={() => onTabPress('my_event')}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: TAB_BAR_HEIGHT,
        // Transparent because SVG determines shape
        backgroundColor: 'transparent',
        elevation: 0,
    },
    svgContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // Make sure it has shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,  // Android shadow on SVG container requires care, often needs background
        backgroundColor: 'transparent'
    },
    svg: {
        // SVG might need a bit more height to accommodate the curve drop if any 
        // Although our curve drops IN, so standard height ok.
        position: 'absolute',
        bottom: 0,
    },
    tabsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    sideTabs: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    centerSpacer: {
        flex: 1.5, // Space for the hole
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: TAB_BAR_HEIGHT,
    },

    // Center Button Styles
    centerButtonContainer: {
        position: 'absolute',
        bottom: 25, // Move up to float
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    centerButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFD700', // Yellow
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow for the button
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 4,
        borderColor: '#FFFFF0', // Match screen background color to look separated? or White?
        // Usually white to match the bar if it sits in the hole
        // But our hole is inside the bar.
    },
    centerButtonActive: {
        transform: [{ scale: 1.1 }]
    },
    centerButtonText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1E3A5F',
        marginTop: 5,
        // Optional: verify visibility against background
        // Since button floats above, text might overlap SVG bar or content?
        // If bottom: 25, the button center is at -5 relative to bar top (70). 
        // 60 height -> top is at 25-30 = -5. Bottom at 55. 
        // Text is below button. Might fall onto the bar.
        // It's okay.
    }
});
