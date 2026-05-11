import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Svg, { Circle, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import OnboardingSlide from './OnboardingSlide';

const { width, height } = Dimensions.get('window');

const logoAsset = require('../assets/logo.svg');
const manAsset = require('../assets/splashscreen/man.svg');
const popperAsset = require('../assets/splashscreen/sml_popper.svg');
const bgCircleAsset = require('../assets/splashscreen/bg_Circle.svg');
const FOOD_DATA = [
  // Slide 0
  [
    { source: require('../assets/splashscreen/food/fp1.png'), style: { top: '20%', left: '33%', width: 65, height: 65 } },
    { source: require('../assets/splashscreen/food/fp2.png'), style: { top: '48%', left: '5%', width: 60, height: 60 } },
    { source: require('../assets/splashscreen/food/fp3.png'), style: { bottom: '33%', right: '5%', width: 70, height: 70 } },
  ],
  // Slide 1
  [
    { source: require('../assets/splashscreen/food/fp4.png'), style: { top: '32%', left: '10%', width: 55, height: 55 } },
    { source: require('../assets/splashscreen/food/fp5.png'), style: { top: '25%', right: '12%', width: 60, height: 60 } },
    { source: require('../assets/splashscreen/food/fp6.png'), style: { bottom: '30%', right: '5%', width: 65, height: 65 } },
  ],
  // Slide 2
  [
    { source: require('../assets/splashscreen/food/fp7.png'), style: { top: '32%', left: '8%', width: 60, height: 60 } },
    { source: require('../assets/splashscreen/food/fp8.png'), style: { top: '28%', right: '8%', width: 55, height: 55 } },
    { source: require('../assets/splashscreen/food/fp9.png'), style: { bottom: '30%', right: '15%', width: 55, height: 55 } },
  ]
];

const slides = [
  {
    title: 'Delicious moments beautifully served',
    subtitle: 'Expert catering for your special occasions',
  },
  {
    title: 'Made to impress served with love',
    subtitle: 'Crafting unforgettable experiences for every guest',
  },
  {
    title: 'Vizhaa make your event a culinary masterpiece',
    subtitle: 'From intimate gatherings to grand celebrations',
  },
];

const POPPER_POSITIONS = [
  { top: '22%', right: '4%' },
  { bottom: '34%', left: '2%' },
];

const AnimatedFoodItem = ({ source, style, delay = 0, counterRotate }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim, delay]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <Animated.View style={[style, { transform: [{ translateY }, { rotate: counterRotate }] }]}>
      <Image source={source} style={{ width: '100%', height: '100%' }} contentFit="contain" transition={400} />
    </Animated.View>
  );
};

const Onboarding = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const orbitAnim = useRef(new Animated.Value(0)).current;

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (currentPage + 1) % slides.length;
      pagerRef.current?.setPage(nextPage);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentPage]);

  // Animate progress bar & orbit on page change
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentPage + 1) / slides.length,
      duration: 400,
      useNativeDriver: false,
    }).start();

    // Trigger orbit rotation
    orbitAnim.setValue(0);
    Animated.timing(orbitAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start();
  }, [currentPage]);

  const ringRotate = orbitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const counterRotate = orbitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg']
  });

  const currentSlide = slides[currentPage];
  const currentFoods = FOOD_DATA[currentPage] || FOOD_DATA[0];

  return (
    <View style={styles.container}>
      {/* RADIAL GRADIENT BACKGROUND */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient id="bgGrad" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="100%" stopColor="#F2CF0D" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgGrad)" />
        </Svg>
      </View>

      {/* SUBTLE TOP HIGHLIGHT */}
      <LinearGradient
        colors={['rgba(255,255,255,0.35)', 'transparent']}
        style={styles.topHighlight}
      />

      {/* BACKGROUND RINGS */}
      <View style={styles.circleBackground} pointerEvents="none">
        <Image source={bgCircleAsset} style={{ width: width * 0.9, height: width * 0.9 }} contentFit="contain" />
      </View>

      {/* HEADER — logo + brand name */}
      <View style={styles.fixedHeader} pointerEvents="none">
        <View style={styles.logoRow}>
          <Image source={logoAsset} style={styles.logoIcon} contentFit="contain" />
          <Text style={styles.logoName}>vizhaa</Text>
        </View>
      </View>

      {/* CENTER AVATAR & FLOATING FOOD */}
      <View style={styles.avatarContainer} pointerEvents="none">
        {POPPER_POSITIONS.map((pos, index) => (
          <Image key={index} source={popperAsset} style={[styles.popper, pos]} contentFit="contain" />
        ))}
        
        <Image source={manAsset} style={styles.centerAvatar} contentFit="contain" />

        <Animated.View style={[styles.orbitContainer, { transform: [{ rotate: ringRotate }] }]} pointerEvents="none">
          <AnimatedFoodItem 
            source={currentFoods[0].source} 
            style={[styles.foodItem, currentFoods[0].style]} 
            delay={0} 
            counterRotate={counterRotate}
          />
          <AnimatedFoodItem 
            source={currentFoods[1].source} 
            style={[styles.foodItem, currentFoods[1].style]} 
            delay={800} 
            counterRotate={counterRotate}
          />
          <AnimatedFoodItem 
            source={currentFoods[2].source} 
            style={[styles.foodItem, currentFoods[2].style]} 
            delay={1600} 
            counterRotate={counterRotate}
          />
        </Animated.View>
      </View>

      {/* PAGER — horizontal slide text */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slideContainer}>
            <OnboardingSlide title={slide.title} subtitle={slide.subtitle} />
          </View>
        ))}
      </PagerView>

      {/* FIXED FOOTER */}
      <View style={styles.fixedFooter} pointerEvents="box-none">

        {/* Step indicator dots */}
        <View style={styles.paginationContainer}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentPage === i ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Legal */}
        <Text style={styles.footerText}>
          By continuing, you accept{' '}
          <Text style={styles.link}>Privacy Policy</Text>
          {' '}and{' '}
          <Text style={styles.link}>T&C</Text>
        </Text>

        {/* CTA Button */}
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={onComplete}>
          <LinearGradient
            colors={['#1A1A1A', '#000000']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Plan Your Dream Day</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    zIndex: 1,
  },

  circleBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  // ─── Header ───────────────────────────────────────────────
  fixedHeader: {
    position: 'absolute',
    top: 56,
    width: '100%',
    alignItems: 'center',
    zIndex: 100,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 40,
  },
  logoName: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: '#2C1206',
    letterSpacing: -0.8,
  },
  avatarContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    top: -80,
  },
  orbitContainer: {
    position: 'absolute',
    width: width,
    height: width * 1.2,
  },
  centerAvatar: {
    width: width * 0.45,
    height: width * 0.45,
    zIndex: 2,
    marginTop: 15,
  },
  popper: {
    position: 'absolute',
    width: 50,
    height: 50,
    opacity: 0.8,
  },
  foodItem: {
    position: 'absolute',
    zIndex: 3,
  },

  // ─── Pager ────────────────────────────────────────────────
  pagerView: {
    flex: 1,
    zIndex: 50,
  },
  slideContainer: {
    width,
    height,
  },

  // ─── Footer ───────────────────────────────────────────────
  fixedFooter: {
    position: 'absolute',
    bottom: 36,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 28,
    zIndex: 100,
  },

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
  activeDot: {
    width: 32,
    backgroundColor: '#2C1206',
  },
  inactiveDot: {
    width: 7,
    backgroundColor: 'rgba(44,18,6,0.25)',
  },

  footerText: {
    fontSize: 11,
    color: 'rgba(44,18,6,0.65)',
    marginBottom: 16,
    fontFamily: 'Outfit_400Regular',
    textAlign: 'center',
    lineHeight: 17,
  },
  link: {
    fontFamily: 'Outfit_600SemiBold',
    color: '#2C1206',
  },

  // CTA button
  button: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#F2CF0D',
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    letterSpacing: 0,
    textAlign: 'center',
  },
});

export default Onboarding;