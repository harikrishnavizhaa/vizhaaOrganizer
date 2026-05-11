import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const BlobBackground = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[s.blob, { top: -55, left: -55, width: 175, height: 175, backgroundColor: '#F5C518', opacity: 0.45 }]} />
    <View style={[s.blob, { top: 72, right: 32, width: 52, height: 52, backgroundColor: '#F5C518', opacity: 0.4 }]} />
    <View style={[s.blob, { top: height * 0.42, left: 8, width: 62, height: 62, backgroundColor: '#F5C518', opacity: 0.32 }]} />
    <View style={[s.blob, { bottom: 105, left: 25, width: 68, height: 68, backgroundColor: '#F5C518', opacity: 0.38 }]} />
    <View style={[s.blob, { bottom: -55, right: -45, width: 200, height: 200, backgroundColor: '#F5A623', opacity: 0.5 }]} />
  </View>
);

const s = StyleSheet.create({
  blob: { position: 'absolute', borderRadius: 999 },
});

export default BlobBackground;
