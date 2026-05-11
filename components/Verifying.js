import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BlobBackground from './BlobBackground';

const Verifying = ({ onDone }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: false,
    }).start(() => {
      onDone && onDone();
    });
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '68%'],
  });

  return (
    <View style={styles.container}>
      <BlobBackground />
      <View style={styles.card}>
        <Text style={styles.title}>Verifying...</Text>
        <Text style={styles.subtitle}>
          Do not press back or switch apps while we verify details.
        </Text>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: barWidth }]}>
            <LinearGradient
              colors={['#E53935', '#FB8C00', '#FDD835', '#43A047', '#1E88E5', '#8E24AA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#EBEBEB',
    borderRadius: 28,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },

  title: {
    fontSize: 26,
    fontFamily: 'Outfit_700Bold',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#888',
    lineHeight: 18,
    marginBottom: 32,
  },

  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D8D8D8',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
});

export default Verifying;
