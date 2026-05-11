import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SuccessScreen = ({ amount, onDone }) => {
  const transactionId = Math.random().toString().slice(2, 18);
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
  const timeStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' IST';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon & Text */}
        <View style={styles.iconContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Ionicons name="checkmark-sharp" size={40} color="#FFF" />
            </View>
          </View>
          {/* Mock Confetti */}
          {[...Array(8)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.confetti, 
                { 
                  top: Math.random() * 100, 
                  left: Math.random() * 200 - 50,
                  backgroundColor: ['#FFD700', '#FFB800', '#D2B48C'][i % 3],
                  transform: [{ rotate: `${Math.random() * 360}deg` }]
                }
              ]} 
            />
          ))}
        </View>

        <Text style={styles.thankYouText}>Thank You</Text>
        <Text style={styles.subtitle}>Your payment has processed successful</Text>

        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          <View style={styles.cardHeader}>
            <View style={styles.dot} />
            <View style={styles.dashedLine} />
            <View style={styles.dot} />
          </View>

          <View style={styles.details}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>{transactionId}</Text>

            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>₹{amount || '125'}</Text>

            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.value}>{dateStr} | {timeStr}</Text>
          </View>

          {/* Scalloped Edge Mockup */}
          <View style={styles.scallopedBottom}>
            {[...Array(10)].map((_, i) => (
              <View key={i} style={styles.scallop} />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confetti: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  thankYouText: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingTop: 30,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: -10,
    marginBottom: 20,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginHorizontal: -10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
  },
  details: {
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  scallopedBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: -10,
  },
  scallop: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  doneBtn: {
    marginTop: 40,
    backgroundColor: '#7B3F00',
    width: '100%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
});

export default SuccessScreen;
