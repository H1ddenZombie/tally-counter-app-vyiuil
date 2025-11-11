
import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View, Text, Pressable, Alert, Platform, ScrollView, Modal } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import TallyCounter from "@/components/TallyCounter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useFocusEffect } from "@react-navigation/native";

const FIRST_TIME_KEY = '@tally_counter_first_time';
const DIGIT_COUNT_KEY = '@tally_counter_digit_count';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [showInstructions, setShowInstructions] = useState(false);
  const [digitCount, setDigitCount] = useState<2 | 3 | 4>(4);

  useEffect(() => {
    checkFirstTime();
    loadDigitCount();
  }, []);

  // Reload digit count when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadDigitCount();
    }, [])
  );

  const loadDigitCount = async () => {
    try {
      const savedCount = await AsyncStorage.getItem(DIGIT_COUNT_KEY);
      if (savedCount) {
        setDigitCount(parseInt(savedCount) as 2 | 3 | 4);
        console.log('Loaded digit count:', savedCount);
      }
    } catch (error) {
      console.log('Error loading digit count:', error);
    }
  };

  const checkFirstTime = async () => {
    try {
      const hasSeenInstructions = await AsyncStorage.getItem(FIRST_TIME_KEY);
      console.log('Has seen instructions:', hasSeenInstructions);
      
      if (hasSeenInstructions === null) {
        // First time user
        setShowInstructions(true);
        await AsyncStorage.setItem(FIRST_TIME_KEY, 'true');
      }
    } catch (error) {
      console.log('Error checking first time:', error);
    }
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => setShowInstructions(true)}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="questionmark.circle" color={theme.colors.primary} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => {
        console.log('Navigating to settings page');
        router.push('/(tabs)/profile');
      }}
      style={styles.headerButtonContainer}
    >
      <IconSymbol
        name="gear"
        color={theme.colors.primary}
      />
    </Pressable>
  );

  const getSubtitleText = () => {
    const maxCount = Math.pow(10, digitCount) - 1;
    return `Count up to ${maxCount} with rotating mechanical dials`;
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Tally Counter",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Vintage Tally Counter
            </Text>
            <Text style={[styles.subtitle, { color: theme.dark ? '#8E8E93' : '#666' }]}>
              {getSubtitleText()}
            </Text>
          </View>
          
          <TallyCounter digitCount={digitCount} />
        </ScrollView>
      </View>

      {/* Instructions Modal */}
      <Modal
        visible={showInstructions}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseInstructions}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={handleCloseInstructions}
        >
          <BlurView
            intensity={Platform.OS === 'ios' ? 80 : 100}
            tint={theme.dark ? 'dark' : 'light'}
            style={styles.blurView}
          >
            <Pressable 
              style={styles.modalContentWrapper}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={[
                styles.modalContent,
                { 
                  backgroundColor: theme.dark ? '#1C1C1E' : '#FFFFFF',
                  borderColor: theme.dark ? '#3A3A3C' : '#E5E5E5',
                }
              ]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                    How to Use
                  </Text>
                  <Pressable
                    onPress={handleCloseInstructions}
                    style={styles.closeButton}
                  >
                    <IconSymbol 
                      name="xmark.circle.fill" 
                      size={28} 
                      color={theme.dark ? '#8E8E93' : '#666'} 
                    />
                  </Pressable>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.instructionItem}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.dark ? '#2C2C2E' : '#F2F2F7' }]}>
                      <IconSymbol name="plus" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.instructionText, { color: theme.dark ? '#E5E5E7' : '#333' }]}>
                      Press + to increment the counter
                    </Text>
                  </View>

                  <View style={styles.instructionItem}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.dark ? '#2C2C2E' : '#F2F2F7' }]}>
                      <IconSymbol name="minus" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.instructionText, { color: theme.dark ? '#E5E5E7' : '#333' }]}>
                      Press − to decrement the counter
                    </Text>
                  </View>

                  <View style={styles.instructionItem}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.dark ? '#2C2C2E' : '#F2F2F7' }]}>
                      <IconSymbol name="arrow.counterclockwise" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.instructionText, { color: theme.dark ? '#E5E5E7' : '#333' }]}>
                      Press RESET to return to zero
                    </Text>
                  </View>

                  <View style={styles.instructionItem}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.dark ? '#2C2C2E' : '#F2F2F7' }]}>
                      <IconSymbol name="gearshape.2" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.instructionText, { color: theme.dark ? '#E5E5E7' : '#333' }]}>
                      Watch the dials rotate like a vintage mechanical counter
                    </Text>
                  </View>

                  <View style={styles.instructionItem}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.dark ? '#2C2C2E' : '#F2F2F7' }]}>
                      <IconSymbol name="slider.horizontal.3" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.instructionText, { color: theme.dark ? '#E5E5E7' : '#333' }]}>
                      Go to Settings to change the number of digits (2, 3, or 4)
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={handleCloseInstructions}
                  style={[
                    styles.gotItButton,
                    { backgroundColor: theme.colors.primary }
                  ]}
                >
                  <Text style={styles.gotItButtonText}>Got it!</Text>
                </Pressable>
              </View>
            </Pressable>
          </BlurView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  headerButtonContainer: {
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.3)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  gotItButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  gotItButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
