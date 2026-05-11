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
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import OnboardingSlide from './OnboardingSlide';

const { width, height } = Dimensions.get('window');

const logoAsset = require('../assets/logo.svg');
const manAsset = require('../assets/splashscreen/man.svg');
const popperAsset = require('../assets/splashscreen/sml_popper.svg');

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

// Removed AnimatedFoodItem and FoodOverlay as we use Lottie now

const Onboarding = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (currentPage + 1) % slides.length;
      pagerRef.current?.setPage(nextPage);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentPage]);

  // Animate progress bar on page change
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentPage + 1) / slides.length,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentPage]);

  const currentSlide = slides[currentPage];

  return (
    <View style={styles.container}>
      {/* GRADIENT BACKGROUND — warm amber-to-gold */}
      <LinearGradient
        colors={['#FFE44D', '#FFC200', '#FFB300']}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* SUBTLE TOP HIGHLIGHT */}
      <LinearGradient
        colors={['rgba(255,255,255,0.35)', 'transparent']}
        style={styles.topHighlight}
      />

      {/* BACKGROUND RINGS */}
      <View style={styles.circleBackground} pointerEvents="none">
        <Svg
          height={width * 1.6}
          width={width * 1.6}
          viewBox="0 0 400 400"
        >
          <Defs>
            <RadialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#7A3010" stopOpacity="0.0" />
              <Stop offset="100%" stopColor="#7A3010" stopOpacity="0.07" />
            </RadialGradient>
          </Defs>
          <Circle cx="200" cy="200" r="100" fill="none" stroke="#7A3010" strokeOpacity="0.07" strokeWidth="1.5" />
          <Circle cx="200" cy="200" r="140" fill="none" stroke="#7A3010" strokeOpacity="0.055" strokeWidth="1.2" />
          <Circle cx="200" cy="200" r="180" fill="none" stroke="#7A3010" strokeOpacity="0.04" strokeWidth="1" />
          <Circle cx="200" cy="200" r="100" fill="#7A3010" fillOpacity="0.035" />
        </Svg>
      </View>

      {/* HEADER — logo + brand name */}
      {/* <View style={styles.fixedHeader} pointerEvents="none">
        <View style={styles.logoRow}>
          <Image source={logoAsset} style={styles.logoIcon} contentFit="contain" />
          <Text style={styles.logoName}>vizhaa</Text>
        </View>
      </View> */}

      {/* LOTTIE ANIMATION BACKGROUND */}
      <View style={styles.lottieContainer} pointerEvents="none">
        <LottieView
          source={require('../assets/splashscreen/animation.json')}
          autoPlay
          loop
          style={styles.lottie}
          resizeMode="cover"
        />
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
  lottieContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  lottie: {
    width: width,
    height: height,
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
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});

export default Onboarding;