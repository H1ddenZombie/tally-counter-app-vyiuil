
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

const DIGIT_COUNT_KEY = '@tally_counter_digit_count';

export default function ProfileScreen() {
  const theme = useTheme();
  const [digitCount, setDigitCount] = useState<2 | 3 | 4>(4);

  useEffect(() => {
    loadDigitCount();
  }, []);

  const loadDigitCount = async () => {
    try {
      const savedCount = await AsyncStorage.getItem(DIGIT_COUNT_KEY);
      if (savedCount) {
        setDigitCount(parseInt(savedCount) as 2 | 3 | 4);
      }
    } catch (error) {
      console.log('Error loading digit count:', error);
    }
  };

  const handleDigitCountChange = async (count: 2 | 3 | 4) => {
    try {
      setDigitCount(count);
      await AsyncStorage.setItem(DIGIT_COUNT_KEY, count.toString());
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      console.log('Digit count saved:', count);
    } catch (error) {
      console.log('Error saving digit count:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
        </View>

        <GlassView style={[
          styles.section,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          <View style={styles.sectionHeader}>
            <IconSymbol name="gearshape.fill" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Counter Display</Text>
          </View>
          
          <Text style={[styles.sectionDescription, { color: theme.dark ? '#98989D' : '#666' }]}>
            Choose how many digits to display on the tally counter
          </Text>

          <View style={styles.optionsContainer}>
            <Pressable
              onPress={() => handleDigitCountChange(2)}
              style={({ pressed }) => [
                styles.optionButton,
                digitCount === 2 && styles.optionButtonActive,
                {
                  backgroundColor: digitCount === 2 
                    ? theme.colors.primary 
                    : theme.dark ? '#2C2C2E' : '#F2F2F7',
                  opacity: pressed ? 0.7 : 1,
                  borderColor: digitCount === 2 
                    ? theme.colors.primary 
                    : theme.dark ? '#3A3A3C' : '#E5E5E5',
                }
              ]}
            >
              <Text style={[
                styles.optionText,
                { color: digitCount === 2 ? '#FFFFFF' : theme.colors.text }
              ]}>
                2 Digits
              </Text>
              <Text style={[
                styles.optionSubtext,
                { color: digitCount === 2 ? 'rgba(255,255,255,0.8)' : theme.dark ? '#8E8E93' : '#666' }
              ]}>
                00-99
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleDigitCountChange(3)}
              style={({ pressed }) => [
                styles.optionButton,
                digitCount === 3 && styles.optionButtonActive,
                {
                  backgroundColor: digitCount === 3 
                    ? theme.colors.primary 
                    : theme.dark ? '#2C2C2E' : '#F2F2F7',
                  opacity: pressed ? 0.7 : 1,
                  borderColor: digitCount === 3 
                    ? theme.colors.primary 
                    : theme.dark ? '#3A3A3C' : '#E5E5E5',
                }
              ]}
            >
              <Text style={[
                styles.optionText,
                { color: digitCount === 3 ? '#FFFFFF' : theme.colors.text }
              ]}>
                3 Digits
              </Text>
              <Text style={[
                styles.optionSubtext,
                { color: digitCount === 3 ? 'rgba(255,255,255,0.8)' : theme.dark ? '#8E8E93' : '#666' }
              ]}>
                000-999
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleDigitCountChange(4)}
              style={({ pressed }) => [
                styles.optionButton,
                digitCount === 4 && styles.optionButtonActive,
                {
                  backgroundColor: digitCount === 4 
                    ? theme.colors.primary 
                    : theme.dark ? '#2C2C2E' : '#F2F2F7',
                  opacity: pressed ? 0.7 : 1,
                  borderColor: digitCount === 4 
                    ? theme.colors.primary 
                    : theme.dark ? '#3A3A3C' : '#E5E5E5',
                }
              ]}
            >
              <Text style={[
                styles.optionText,
                { color: digitCount === 4 ? '#FFFFFF' : theme.colors.text }
              ]}>
                4 Digits
              </Text>
              <Text style={[
                styles.optionSubtext,
                { color: digitCount === 4 ? 'rgba(255,255,255,0.8)' : theme.dark ? '#8E8E93' : '#666' }
              ]}>
                0000-9999
              </Text>
            </Pressable>
          </View>
        </GlassView>

        <GlassView style={[
          styles.section,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          <View style={styles.sectionHeader}>
            <IconSymbol name="info.circle.fill" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.dark ? '#98989D' : '#666' }]}>Version</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>1.0.0</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.dark ? '#98989D' : '#666' }]}>App Name</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>Vintage Tally Counter</Text>
          </View>
        </GlassView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButtonActive: {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionSubtext: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});
