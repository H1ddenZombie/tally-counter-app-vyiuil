
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@react-navigation/native';

interface DialProps {
  digit: number;
  position: number;
}

interface TallyCounterProps {
  digitCount?: 2 | 3 | 4;
}

const DIAL_HEIGHT = 60;
const NUMBER_HEIGHT = 60;

const Dial: React.FC<DialProps> = ({ digit, position }) => {
  const theme = useTheme();
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    // Animate translation when digit changes
    // Each number slot is NUMBER_HEIGHT tall, so we move by digit * -NUMBER_HEIGHT
    translateY.value = withSpring(digit * -NUMBER_HEIGHT, {
      damping: 15,
      stiffness: 100,
    });
    
    // Add a subtle scale animation
    scale.value = withSequence(
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  }, [digit]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
      ],
    };
  });

  const dialTranslateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <Animated.View style={[styles.dialContainer, animatedStyle]}>
      <View style={[
        styles.dialFrame,
        { 
          backgroundColor: theme.dark ? '#2C2C2E' : '#E5E5E5',
          borderColor: theme.dark ? '#48484A' : '#C7C7CC',
        }
      ]}>
        <View style={styles.dialWindow}>
          <Animated.View style={[styles.dialNumbers, dialTranslateStyle]}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <View key={num} style={styles.numberSlot}>
                <Text style={[
                  styles.dialNumber,
                  { color: theme.dark ? '#FFFFFF' : '#000000' }
                ]}>
                  {num}
                </Text>
              </View>
            ))}
          </Animated.View>
        </View>
        {/* Dial decorative elements */}
        <View style={[styles.dialTopShadow, { backgroundColor: theme.dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }]} />
        <View style={[styles.dialBottomShadow, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)' }]} />
      </View>
    </Animated.View>
  );
};

export default function TallyCounter({ digitCount = 4 }: TallyCounterProps) {
  const theme = useTheme();
  const [count, setCount] = useState(0);
  const buttonScale = useSharedValue(1);

  // Calculate max count based on digit count
  const maxCount = React.useMemo(() => {
    return Math.pow(10, digitCount) - 1;
  }, [digitCount]);

  // Reset count if it exceeds the new max when digit count changes
  useEffect(() => {
    if (count > maxCount) {
      setCount(0);
    }
  }, [digitCount, maxCount]);

  const digits = React.useMemo(() => {
    const countStr = count.toString().padStart(digitCount, '0');
    return countStr.split('').map(Number);
  }, [count, digitCount]);

  const handleIncrement = () => {
    if (count < maxCount) {
      setCount(count + 1);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <View style={styles.container}>
      {/* Counter Body */}
      <View style={[
        styles.counterBody,
        {
          backgroundColor: theme.dark ? '#1C1C1E' : '#D4C5B0',
          boxShadow: theme.dark 
            ? '0px 8px 24px rgba(0, 0, 0, 0.6)' 
            : '0px 8px 24px rgba(0, 0, 0, 0.3)',
        }
      ]}>
        {/* Top Label */}
        <View style={styles.labelContainer}>
          <Text style={[
            styles.label,
            { color: theme.dark ? '#8E8E93' : '#5C4A3A' }
          ]}>
            TALLY COUNTER
          </Text>
        </View>

        {/* Dials Container */}
        <View style={styles.dialsContainer}>
          {digits.map((digit, index) => (
            <Dial key={index} digit={digit} position={index} />
          ))}
        </View>

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          <Pressable
            onPress={handleDecrement}
            disabled={count === 0}
            style={({ pressed }) => [
              styles.button,
              styles.decrementButton,
              {
                backgroundColor: theme.dark ? '#3A3A3C' : '#8B7355',
                opacity: count === 0 ? 0.4 : pressed ? 0.7 : 1,
                boxShadow: pressed 
                  ? '0px 2px 4px rgba(0, 0, 0, 0.2)' 
                  : '0px 4px 8px rgba(0, 0, 0, 0.3)',
              }
            ]}
          >
            <Text style={styles.buttonText}>−</Text>
          </Pressable>

          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [
              styles.button,
              styles.resetButton,
              {
                backgroundColor: theme.dark ? '#2C2C2E' : '#A08968',
                opacity: pressed ? 0.7 : 1,
                boxShadow: pressed 
                  ? '0px 2px 4px rgba(0, 0, 0, 0.2)' 
                  : '0px 4px 8px rgba(0, 0, 0, 0.3)',
              }
            ]}
          >
            <Text style={[styles.buttonText, styles.resetButtonText]}>RESET</Text>
          </Pressable>

          <Pressable
            onPress={handleIncrement}
            disabled={count === maxCount}
            style={({ pressed }) => [
              styles.button,
              styles.incrementButton,
              {
                backgroundColor: theme.dark ? '#3A3A3C' : '#8B7355',
                opacity: count === maxCount ? 0.4 : pressed ? 0.7 : 1,
                boxShadow: pressed 
                  ? '0px 2px 4px rgba(0, 0, 0, 0.2)' 
                  : '0px 4px 8px rgba(0, 0, 0, 0.3)',
              }
            ]}
          >
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>

        {/* Decorative screws */}
        <View style={styles.screwsContainer}>
          <View style={[styles.screw, { backgroundColor: theme.dark ? '#48484A' : '#6B5A47', top: 0, left: 0 }]} />
          <View style={[styles.screw, { backgroundColor: theme.dark ? '#48484A' : '#6B5A47', top: 0, right: 0 }]} />
          <View style={[styles.screw, { backgroundColor: theme.dark ? '#48484A' : '#6B5A47', bottom: 0, left: 0 }]} />
          <View style={[styles.screw, { backgroundColor: theme.dark ? '#48484A' : '#6B5A47', bottom: 0, right: 0 }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  counterBody: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  labelContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dialsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dialContainer: {
    alignItems: 'center',
  },
  dialFrame: {
    width: 70,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialWindow: {
    width: 70,
    height: DIAL_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dialNumbers: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 70,
  },
  numberSlot: {
    height: NUMBER_HEIGHT,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialNumber: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
    lineHeight: NUMBER_HEIGHT,
    textAlign: 'center',
  },
  dialTopShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    pointerEvents: 'none',
    zIndex: 10,
  },
  dialBottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 10,
    pointerEvents: 'none',
    zIndex: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  decrementButton: {
    maxWidth: 80,
  },
  incrementButton: {
    maxWidth: 80,
  },
  resetButton: {
    flex: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  resetButtonText: {
    fontSize: 16,
    letterSpacing: 1,
  },
  screwsContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    pointerEvents: 'none',
  },
  screw: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
});
