import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_W } = Dimensions.get('window');
const PILL_W = SCREEN_W * 0.94;

const POPUP = 28;
const BAR_H = 78;
const PAD_B = 12;
const BUBBLE = 60;
const CENTRE_D = 60;

const TOP_H = POPUP + BUBBLE / 2;
const BOT_H = BAR_H - BUBBLE / 2;

const TABS = [
  { key: 'profile', label: 'Profile', base: 'person', lib: 'ion' },
  { key: 'status', label: 'Status', base: 'pencil', lib: 'mc' },
  { key: 'dashboard', label: 'My Event', base: 'calendar', lib: 'ion', isCentre: true },
  { key: 'payment-tab', label: 'Payment', base: 'card', lib: 'ion' },
  { key: 'history', label: 'History', base: 'time', lib: 'ion' },
];

const TabIcon = ({ base, lib, active, size = 20 }) => {
  const name = active ? base : `${base}-outline`;
  const color = active ? '#2C1206' : '#FFF';
  return lib === 'mc'
    ? <MaterialCommunityIcons name={name} size={size} color={color} />
    : <Ionicons name={name} size={size} color={color} />;
};

const BottomTabBar = ({ activeTab, onNavigate }) => {
  const [layouts, setLayouts] = useState({});
  const activeIndex = TABS.findIndex(t => t.key === activeTab);

  // Calculate initial position estimate
  const getX = (index, layout) => {
    if (layout) return layout.x + layout.width / 2 - BUBBLE / 2;
    const perTab = (PILL_W - 20) / TABS.length;
    return 10 + (perTab * index) + perTab / 2 - BUBBLE / 2;
  };

  const translateX = useRef(new Animated.Value(getX(activeIndex))).current;
  const scale = useRef(new Animated.Value(activeTab === 'dashboard' ? CENTRE_D / BUBBLE : 1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const layout = layouts[activeTab];
    const targetX = getX(activeIndex, layout);

    Animated.parallel([
      Animated.spring(translateX, {
        toValue: targetX,
        useNativeDriver: true,
        bounciness: 12,
        speed: 12,
      }),
      Animated.spring(scale, {
        toValue: activeTab === 'dashboard' ? CENTRE_D / BUBBLE : 1,
        useNativeDriver: true,
        bounciness: 12,
        speed: 12,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab, layouts]);

  const handleLayout = (key, e) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts(prev => ({ ...prev, [key]: { x, width } }));
  };

  const activeTabInfo = TABS.find(t => t.key === activeTab);

  return (
    <View style={s.wrap}>
      <View style={s.pill} />
      <View style={s.row}>
        {/* Sliding Bubble */}
        <Animated.View style={[
          s.bubble,
          {
            position: 'absolute',
            left: 0,
            top: TOP_H - BUBBLE,
            opacity: opacity,
            transform: [
              { translateX },
              { scale },
            ],
            zIndex: 10,
          }
        ]}>
          {activeTabInfo && (
            <TabIcon
              base={activeTabInfo.base}
              lib={activeTabInfo.lib}
              active
              size={26}
            />
          )}
        </Animated.View>

        {TABS.map((tab) => {
          const on = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onLayout={(e) => handleLayout(tab.key, e)}
              style={[s.btn, tab.isCentre && s.centreBtn]}
              onPress={() => onNavigate(tab.key)}
              activeOpacity={0.7}
            >
              <View style={s.topZone} />
              <View style={s.botZone}>
                {!on && <TabIcon base={tab.base} lib={tab.lib} active={false} />}
                <Text style={[s.label, on && s.labelOn]}>{tab.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: POPUP + BAR_H + PAD_B,
    alignItems: 'center',
  },
  pill: {
    position: 'absolute',
    bottom: PAD_B,
    width: '94%',
    height: BAR_H,
    backgroundColor: '#2C1206',
    borderRadius: BAR_H / 2,
  },
  row: {
    position: 'absolute',
    bottom: PAD_B,
    width: PILL_W,
    height: TOP_H + BOT_H,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  centreBtn: {
    width: 60,
  },
  btn: {
    width: 54,
  },
  topZone: {
    height: TOP_H,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  botZone: {
    height: BOT_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    width: BUBBLE,
    height: BUBBLE,
    borderRadius: BUBBLE / 2,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4.5,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  label: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Outfit_400Regular',
    marginTop: 2,
  },
  labelOn: {
    color: '#FFD700',
    fontFamily: 'Outfit_600SemiBold',
  },
});

export default BottomTabBar;
