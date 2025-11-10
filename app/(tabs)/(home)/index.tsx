
import React from "react";
import { Stack } from "expo-router";
import { StyleSheet, View, Text, Pressable, Alert, Platform, ScrollView } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import TallyCounter from "@/components/TallyCounter";

export default function HomeScreen() {
  const theme = useTheme();

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => Alert.alert("Not Implemented", "This feature is not implemented yet")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="plus" color={theme.colors.primary} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => Alert.alert("Not Implemented", "This feature is not implemented yet")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol
        name="gear"
        color={theme.colors.primary}
      />
    </Pressable>
  );

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
              Count up to 9999 with rotating mechanical dials
            </Text>
          </View>
          
          <TallyCounter />

          <View style={styles.instructions}>
            <Text style={[styles.instructionsTitle, { color: theme.colors.text }]}>
              How to Use
            </Text>
            <View style={styles.instructionItem}>
              <Text style={[styles.instructionText, { color: theme.dark ? '#8E8E93' : '#666' }]}>
                • Press + to increment the counter
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={[styles.instructionText, { color: theme.dark ? '#8E8E93' : '#666' }]}>
                • Press − to decrement the counter
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={[styles.instructionText, { color: theme.dark ? '#8E8E93' : '#666' }]}>
                • Press RESET to return to zero
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={[styles.instructionText, { color: theme.dark ? '#8E8E93' : '#666' }]}>
                • Watch the dials rotate like a vintage mechanical counter
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
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
  instructions: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  instructionItem: {
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
