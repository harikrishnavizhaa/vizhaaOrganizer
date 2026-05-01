import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const slides = [
    {
      title: "Delicious moments beautifully\nserved",
      images: {
        dish1: require('./assets/BufferOne/set.png'),
        dish2: require('./assets/BufferOne/set1.png'),
        dish3: require('./assets/BufferOne/set2.png'),
      }
    },
    {
      title: "Made to impress served\nwith love",
      images: {
        dish1: require('./assets/BufferTwo/set.png'),
        dish2: require('./assets/BufferTwo/set1.png'),
        dish3: require('./assets/BufferTwo/set2.png'),
      }
    },
    {
      title: "Vizhaa make your event a\nculinary masterpiece",
      images: {
        dish1: require('./assets/BufferThree/set.png'),
        dish2: require('./assets/BufferThree/set1.png'),
        dish3: require('./assets/BufferThree/set2.png'),
      }
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      
      Animated.timing(rotationAnim, {
        toValue: nextSlide,
        duration: 700,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
      
    } else {
      // @ts-ignore
      navigation.replace('language_selection');
    }
  };

  const slide = slides[currentSlide];

  // Rotate 360 degrees for each step
  const rotateWrapper = rotationAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '360deg', '720deg']
  });

  // Counter-rotate the items so they don't appear upside down
  const rotateItem = rotationAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '-360deg', '-720deg']
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBE258" />
      <View style={styles.container}>
        
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('./assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Center Artwork */}
        <View style={styles.artworkContainer}>
          <Image source={require('./assets/bg-circle.png')} style={styles.bgCircle} resizeMode="contain" />
          
          {/* Poppers */}
          <Image source={require('./assets/popper.png')} style={[styles.popper, styles.popper1]} resizeMode="contain" />
          <Image source={require('./assets/popper.png')} style={[styles.popper, styles.popper2]} resizeMode="contain" />
          
          <Image source={require('./assets/man.png')} style={styles.man} resizeMode="contain" />
          
          {/* Dish Images Wrapper */}
          <Animated.View style={[styles.dishWrapper, { transform: [{ rotate: rotateWrapper }] }]}>
            <Animated.Image source={slide.images.dish1} style={[styles.dish1, { transform: [{ rotate: rotateItem }] }]} resizeMode="contain" />
            <Animated.Image source={slide.images.dish2} style={[styles.dish2, { transform: [{ rotate: rotateItem }] }]} resizeMode="contain" />
            <Animated.Image source={slide.images.dish3} style={[styles.dish3, { transform: [{ rotate: rotateItem }] }]} resizeMode="contain" />
          </Animated.View>
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomContainer}>
          <Text style={styles.title}>{slide.title}</Text>
          
          {/* Pagination */}
          <View style={styles.pagination}>
             <View style={currentSlide === 0 ? styles.dotActive : styles.dot} />
             <View style={currentSlide === 1 ? styles.dotActive : styles.dot} />
             <View style={currentSlide === 2 ? styles.dotActive : styles.dot} />
          </View>

          <Text style={styles.termsText}>
            By continuing, you accept <Text style={styles.boldText}>Privacy Policy</Text> and <Text style={styles.boldText}>T&C</Text>
          </Text>

          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleNext}>
            <Text style={styles.buttonText}>Plan Your Dream Day</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBE258', // Yellow background from design
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: height * 0.04,
  },
  logoContainer: {
    marginTop: height * 0.04,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.35,
    height: width * 0.2,
  },
  artworkContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  bgCircle: {
    position: 'absolute',
    width: width * 1.15,
    height: width * 1.15,
  },
  man: {
    width: width * 0.55,
    height: width * 0.75,
    position: 'absolute',
    zIndex: 10,
  },
  dishWrapper: {
    position: 'absolute',
    width: width * 0.95,
    height: width * 0.95,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  popper: {
    position: 'absolute',
  },
  popper1: {
    top: '15%',
    right: '5%',
    width: width * 0.12,
    height: width * 0.12,
  },
  popper2: {
    bottom: '15%',
    left: '5%',
    width: width * 0.15,
    height: width * 0.15,
  },
  dish1: {
    position: 'absolute',
    top: '0%',
    left: '29%',
    width: width * 0.22,
    height: width * 0.22,
  },
  dish2: {
    position: 'absolute',
    bottom: '18%',
    left: '3.4%',
    width: width * 0.24,
    height: width * 0.24,
  },
  dish3: {
    position: 'absolute',
    bottom: '17%',
    right: '2.4%',
    width: width * 0.26,
    height: width * 0.26,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: height * 0.03,
    lineHeight: 30,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.04,
  },
  dotActive: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
    marginHorizontal: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginHorizontal: 4,
  },
  termsText: {
    fontSize: 12,
    color: '#000',
    marginBottom: 16,
  },
  boldText: {
    fontWeight: '700',
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FBE258',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SplashScreen;