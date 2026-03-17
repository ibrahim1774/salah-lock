// Full-screen spiritual flow: Quran → Dua → Dhikr
// Content stacks in a scrollable view, sections fade in over time
// Used when apps are locked for the daily reminder

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

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
};

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

const DUA_DELAY_MS = 5000;
const DHIKR_DELAY_MS = 10000;
const DONE_DELAY_MS = 15000;

// Auto-complete mode: 15s per section, auto-unlock after all three
const AUTO_DUA_DELAY_MS = 15000;
const AUTO_DHIKR_DELAY_MS = 30000;
const AUTO_COMPLETE_MS = 45000;

const SpiritualFlowScreen = ({ content, onComplete, autoComplete = false }) => {
  const [showDua, setShowDua] = useState(false);
  const [showDhikr, setShowDhikr] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const scrollViewRef = useRef(null);

  const { verse, dua } = content || {};

  useEffect(() => {
    const duaDelay = autoComplete ? AUTO_DUA_DELAY_MS : DUA_DELAY_MS;
    const dhikrDelay = autoComplete ? AUTO_DHIKR_DELAY_MS : DHIKR_DELAY_MS;
    const doneDelay = autoComplete ? AUTO_COMPLETE_MS : DONE_DELAY_MS;

    const timer1 = setTimeout(() => {
      setShowDua(true);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, duaDelay);

    const timer2 = setTimeout(() => {
      setShowDhikr(true);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, dhikrDelay);

    const timer3 = setTimeout(() => {
      setShowDoneButton(true);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, doneDelay);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [autoComplete]);

  const renderQuran = () => {
    if (!verse) return null;
    return (
      <Animated.View entering={FadeIn.duration(400)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="book" size={22} color={COLORS.accent} />
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
      </Animated.View>
    );
  };

  const renderDua = () => {
    if (!dua) return null;
    return (
      <Animated.View entering={FadeIn.duration(400)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="hands-outline" size={22} color={COLORS.accent} />
          <Text style={styles.sectionTitle}>Daily Dua</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.duaTitle}>{dua.title}</Text>
          <Text style={styles.arabicText}>{dua.arabic}</Text>
          <Text style={styles.transliteration}>{dua.transliteration}</Text>
          <Text style={styles.translation}>{dua.translation}</Text>
          {dua.reference && (
            <View style={styles.reference}>
              <Text style={styles.referenceText}>{dua.reference}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderDhikr = () => (
    <Animated.View entering={FadeIn.duration(400)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="heart" size={22} color={COLORS.accent} />
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
    </Animated.View>
  );

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={styles.overlay}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spiritual Journey</Text>
          <Text style={styles.headerSubtitle}>
            Read, reflect, and remember
          </Text>
        </View>

        {/* Scrollable stacking content */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderQuran()}
          {showDua && renderDua()}
          {showDhikr && renderDhikr()}

          {showDhikr && !showDoneButton && !autoComplete && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.waitContainer}>
              <Text style={styles.waitText}>
                Take a moment to recite the dhikr...
              </Text>
            </Animated.View>
          )}

          {showDoneButton && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.doneContainer}>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={onComplete}
              >
                <Text style={styles.doneButtonText}>I'm Done</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
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
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    color: COLORS.secondaryText,
    marginTop: 4,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
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
  waitContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  waitText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    color: COLORS.tertiaryText,
    fontStyle: 'italic',
  },
  doneContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  doneButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 40,
  },
  doneButtonText: {
    fontSize: 17,
    fontFamily: FONTS.demi,
    color: COLORS.white,
  },
});

export default SpiritualFlowScreen;
