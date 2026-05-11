import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LETTERS = [
  { char: 'ழ', top: '7%',  left: '4%',   size: 72, rotate: '-14deg' },
  { char: 'E', top: '5%',  right: '10%',  size: 62, rotate: '10deg'  },
  { char: 'V', top: '32%', left: '4%',    size: 56, rotate: '-8deg'  },
  { char: 'ஐ', top: '28%', right: '5%',   size: 52, rotate: '12deg'  },
  { char: 'ழ', bottom: '24%', left: '7%', size: 54, rotate: '-10deg' },
  { char: 'G', bottom: '18%', right: '6%',size: 56, rotate: '8deg'   },
  { char: 'ம', bottom: '7%', left: '34%', size: 46, rotate: '-5deg'  },
];

const LanguageSelect = ({ onSelect }) => (
  <View style={styles.container}>
    <LinearGradient
      colors={['#FFFFF5', '#FFFAE0', '#FFF4C2']}
      style={StyleSheet.absoluteFill}
    />
    {LETTERS.map((l, i) => {
      const { char, size, rotate, ...pos } = l;
      return (
        <Text
          key={i}
          style={[styles.floatLetter, pos, { fontSize: size, transform: [{ rotate }] }]}
        >
          {char}
        </Text>
      );
    })}

    <View style={styles.content}>
      <Text style={styles.title}>Choose Language</Text>
      <Text style={styles.subtitle}>Select your preferred language to continue</Text>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.langBtn} onPress={() => onSelect('en')} activeOpacity={0.75}>
          <Text style={styles.langBtnText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.langBtn} onPress={() => onSelect('ta')} activeOpacity={0.75}>
          <Text style={styles.langBtnText}>தமிழ்</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },

  floatLetter: {
    position: 'absolute',
    color: '#C9960C',
    fontFamily: 'Outfit_700Bold',
    opacity: 0.48,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  title: {
    fontSize: 26,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#777',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 20,
  },

  btnRow: { flexDirection: 'row', gap: 16 },

  langBtn: {
    width: 120,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  langBtnText: {
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1A1A1A',
  },
});

export default LanguageSelect;
