import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import BlobBackground from './BlobBackground';

const OTPScreen = ({ phone = '', onVerify, onResend, onSuccess, onChangePhone }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  // 'fetching' → OTP being sent, 'input' → user types, 'validating' → API call in progress
  const [phase, setPhase] = useState('fetching');
  const [resend, setResend] = useState(5);
  const [error, setError] = useState('');
  const [sendError, setSendError] = useState('');

  const r0 = useRef(null);
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const refs = [r0, r1, r2, r3];

  // TESTING MODE: skip OTP send, go straight to input
  useEffect(() => {
    setPhase('input');
    setResend(0);
    r0.current?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'input' || resend <= 0) return;
    const t = setTimeout(() => setResend(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resend, phase]);

  const handleChange = (val, i) => {
    const next = [...otp];
    next[i] = val.replace(/[^0-9]/g, '').slice(-1);
    setOtp(next);
    setError('');
    if (next[i] && i < 3) refs[i + 1].current?.focus();
  };

  const handleKeyPress = (key, i) => {
    if (key === 'Backspace' && !otp[i] && i > 0) {
      const next = [...otp];
      next[i - 1] = '';
      setOtp(next);
      refs[i - 1].current?.focus();
    }
  };

  const filled = otp.filter(Boolean).length;

  const handleVerify = async () => {
    if (filled < 4) { setError('Please enter all 4 digits'); return; }
    setPhase('validating');
    try {
      const data = await onVerify(otp.join(''));
      onSuccess(data);
    } catch (err) {
      setPhase('input');
      setError(err.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResend = async () => {
    if (resend > 0) return;
    setError('');
    setSendError('');
    try {
      await onResend();
      setResend(59);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  const getTitle = () => {
    if (phase === 'validating') return 'SECURING ACCOUNT WITH OTP';
    return 'ENTER OTP TO SECURE YOUR ACCOUNT';
  };

  const getBtnLabel = () => {
    if (phase === 'fetching') return 'Sending OTP...';
    if (phase === 'validating') return 'Validating OTP...';
    return 'Validate OTP';
  };

  const resendLabel =
    phase === 'fetching'
      ? `Sending OTP to +91 ${phone}`
      : resend > 0
      ? `Resend OTP in 00:${String(resend).padStart(2, '0')}`
      : 'Resend OTP';

  return (
    <View style={styles.container}>
      <BlobBackground />
      <View style={styles.card}>
        <Text style={styles.title}>{getTitle()}</Text>

        {phase === 'fetching' ? (
          <Text style={styles.phoneLine}>Sending OTP to +91 {phone} ✏️</Text>
        ) : (
          <TouchableOpacity onPress={onChangePhone} activeOpacity={0.7}>
            <Text style={styles.phoneLine}>
              OTP sent to +91 {phone} <Text style={styles.changeLink}>Change</Text>
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.otpRow}>
          {otp.map((digit, i) => {
            const isActive = phase === 'input' && filled === i;
            const hasError = !!error && i === 3 && !digit;
            return (
              <View
                key={i}
                style={[
                  styles.otpBox,
                  isActive && styles.otpBoxActive,
                  hasError && styles.otpBoxError,
                ]}
              >
                <TextInput
                  ref={refs[i]}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={v => handleChange(v, i)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                  editable={phase === 'input'}
                  caretHidden
                />
                {phase === 'fetching' && !digit && (
                  <Text style={styles.placeholder}>✱</Text>
                )}
                {phase === 'input' && isActive && !digit && (
                  <Text style={styles.cursor}>—</Text>
                )}
              </View>
            );
          })}
        </View>

        {phase === 'fetching' && (
          <Text style={styles.fetchingText}>Sending OTP...</Text>
        )}

        {(error || sendError) ? (
          <Text style={styles.errorText}>{error || sendError}</Text>
        ) : null}

        <TouchableOpacity disabled={resend > 0} onPress={handleResend} activeOpacity={0.7}>
          <Text style={[styles.resendText, resend > 0 && styles.resendDim]}>
            {resendLabel}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />

        <TouchableOpacity
          style={[styles.btn, (phase === 'fetching' || phase === 'validating') && styles.btnDim]}
          onPress={handleVerify}
          activeOpacity={0.85}
          disabled={phase === 'fetching' || phase === 'validating'}
        >
          <Text style={styles.btnText}>{getBtnLabel()}</Text>
        </TouchableOpacity>
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
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },

  title: {
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
    color: '#333',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: 6,
  },
  phoneLine: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#999',
    marginBottom: 6,
    textAlign: 'center',
  },
  changeLink: {
    fontFamily: 'Outfit_600SemiBold',
    color: '#333',
    textDecorationLine: 'underline',
  },

  otpRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 24,
    marginBottom: 18,
  },

  otpBox: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
  },
  otpBoxActive: {
    backgroundColor: '#FFF',
    shadowOpacity: 0.14,
  },
  otpBoxError: {
    backgroundColor: '#FFE4E4',
    borderWidth: 1.5,
    borderColor: '#FF6B6B',
  },
  otpInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#111',
    opacity: 1,
  },
  placeholder: {
    fontSize: 22,
    color: '#CCC',
    fontFamily: 'Outfit_400Regular',
    pointerEvents: 'none',
  },
  cursor: {
    fontSize: 20,
    color: '#AAA',
    fontFamily: 'Outfit_400Regular',
    pointerEvents: 'none',
  },

  fetchingText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#AAA',
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 6,
  },

  resendText: {
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    color: '#333',
    textAlign: 'center',
  },
  resendDim: {
    color: '#AAA',
    fontFamily: 'Outfit_400Regular',
  },

  btn: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDim: {
    backgroundColor: '#555',
  },
  btnText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
  },
});

export default OTPScreen;
