// Full-screen Daily Spiritual Reminder component
// Displays Quran verse, Dua, and Dhikr for the day

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Design system (matching App.js)
const COLORS = {
  white: '#FFFFFF',
  offWhite: '#FAFAFA',
  black: '#000000',
  secondaryText: '#6B6B6B',
  tertiaryText: '#A0A0A0',
  divider: '#E5E5E5',
  accent: '#10B981',
};

const FONTS = {
  primary: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  medium: Platform.OS === 'ios' ? 'AvenirNext-Medium' : 'sans-serif-medium',
  demi: Platform.OS === 'ios' ? 'AvenirNext-DemiBold' : 'sans-serif-condensed',
  bold: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-bold',
  light: Platform.OS === 'ios' ? 'AvenirNext-UltraLight' : 'sans-serif-light',
};

// Static Dhikr data
const DHIKR = [
  {
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Glory be to Allah',
    count: 10,
  },
  {
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'All praise is due to Allah',
    count: 10,
  },
  {
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest',
    count: 10,
  },
];

const DailySpiritualReminder = ({ content, onDismiss }) => {
  const { verse, dua } = content || {};

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Spiritual Reminder</Text>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1: Quran Ayat */}
          {verse && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="book" size={20} color={COLORS.accent} />
                <Text style={styles.sectionTitle}>Quran Verse</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.arabicText}>{verse.arabic}</Text>
                <Text style={styles.transliteration}>{verse.transliteration}</Text>
                <Text style={styles.translation}>{verse.translation}</Text>
                <View style={styles.reference}>
                  <Text style={styles.referenceText}>
                    Surah {verse.surah} - {verse.ayah}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Section 2: Dua */}
          {dua && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="hands-outline" size={20} color={COLORS.accent} />
                <Text style={styles.sectionTitle}>Daily Dua</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.duaTitle}>{dua.title}</Text>
                <Text style={styles.arabicText}>{dua.arabic}</Text>
                <Text style={styles.transliteration}>{dua.transliteration}</Text>
                <Text style={styles.translation}>{dua.translation}</Text>
                {dua.when && (
                  <Text style={styles.whenText}>When: {dua.when}</Text>
                )}
                {dua.reference && (
                  <View style={styles.reference}>
                    <Text style={styles.referenceText}>{dua.reference}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Section 3: Dhikr */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart" size={20} color={COLORS.accent} />
              <Text style={styles.sectionTitle}>Daily Dhikr</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.dhikrIntro}>
                Recite each of the following 10 times:
              </Text>

              {DHIKR.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.dhikrItem,
                    index < DHIKR.length - 1 && styles.dhikrItemBorder,
                  ]}
                >
                  <Text style={styles.dhikrArabic}>{item.arabic}</Text>
                  <Text style={styles.dhikrTransliteration}>
                    {item.transliteration}
                  </Text>
                  <Text style={styles.dhikrMeaning}>{item.meaning}</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{item.count}x</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Spacer for button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Dismiss Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    zIndex: 2000,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    textAlign: 'center',
  },
  headerDate: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.demi,
    color: COLORS.black,
    marginLeft: 8,
  },
  card: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 20,
  },
  arabicText: {
    fontSize: 28,
    fontFamily: FONTS.primary,
    color: COLORS.black,
    textAlign: 'right',
    lineHeight: 48,
    marginBottom: 16,
    writingDirection: 'rtl',
  },
  transliteration: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    fontStyle: 'italic',
    color: COLORS.secondaryText,
    marginBottom: 12,
    lineHeight: 24,
  },
  translation: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    color: COLORS.black,
    lineHeight: 24,
    marginBottom: 12,
  },
  reference: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  referenceText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.tertiaryText,
  },
  duaTitle: {
    fontSize: 17,
    fontFamily: FONTS.demi,
    color: COLORS.accent,
    marginBottom: 16,
  },
  whenText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    color: COLORS.secondaryText,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  dhikrIntro: {
    fontSize: 15,
    fontFamily: FONTS.primary,
    color: COLORS.secondaryText,
    marginBottom: 16,
    textAlign: 'center',
  },
  dhikrItem: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  dhikrItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  dhikrArabic: {
    fontSize: 32,
    fontFamily: FONTS.primary,
    color: COLORS.black,
    marginBottom: 8,
  },
  dhikrTransliteration: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: 4,
  },
  dhikrMeaning: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    color: COLORS.secondaryText,
    marginBottom: 8,
  },
  countBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  countText: {
    fontSize: 14,
    fontFamily: FONTS.demi,
    color: COLORS.white,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  dismissButton: {
    backgroundColor: COLORS.black,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissButtonText: {
    fontSize: 17,
    fontFamily: FONTS.demi,
    color: COLORS.white,
  },
});

export default DailySpiritualReminder;
