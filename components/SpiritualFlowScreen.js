// Full-screen stepped spiritual flow: Quran → Dua → Dhikr
// Used when apps are locked for the daily reminder

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

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

const STEP_LABELS = ['Quran Verse', 'Daily Dua', 'Daily Dhikr'];
const AUTO_ADVANCE_MS = 3000;
const DHIKR_DONE_DELAY_MS = 5000;

const SpiritualFlowScreen = ({ content, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const timerRef = useRef(null);

  const { verse, dua } = content || {};

  // Auto-advance timer for steps 0 and 1; done-button timer for step 2
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (currentStep < 2) {
      timerRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, AUTO_ADVANCE_MS);
    } else if (currentStep === 2) {
      timerRef.current = setTimeout(() => {
        setShowDoneButton(true);
      }, DHIKR_DONE_DELAY_MS);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStep]);

  const handleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEP_LABELS.map((label, i) => (
        <View key={i} style={styles.stepDot}>
          <View
            style={[
              styles.dot,
              i === currentStep && styles.dotActive,
              i < currentStep && styles.dotCompleted,
            ]}
          />
          <Text
            style={[
              styles.stepLabel,
              i === currentStep && styles.stepLabelActive,
            ]}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderQuran = () => {
    if (!verse) return null;
    return (
      <Animated.View
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(300)}
        style={styles.contentContainer}
      >
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
      <Animated.View
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(300)}
        style={styles.contentContainer}
      >
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
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      style={styles.contentContainer}
    >
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
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spiritual Journey</Text>
          <Text style={styles.headerSubtitle}>
            Step {currentStep + 1} of 3
          </Text>
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <View style={styles.scrollArea}>
          {currentStep === 0 && renderQuran()}
          {currentStep === 1 && renderDua()}
          {currentStep === 2 && renderDhikr()}
        </View>

        {/* Bottom Button */}
        <View style={styles.buttonContainer}>
          {currentStep < 2 && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </TouchableOpacity>
          )}
          {currentStep === 2 && showDoneButton && (
            <Animated.View entering={FadeIn.duration(400)}>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={onComplete}
              >
                <Text style={styles.doneButtonText}>I'm Done</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          {currentStep === 2 && !showDoneButton && (
            <Text style={styles.waitText}>
              Take a moment to recite the dhikr...
            </Text>
          )}
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
    paddingBottom: 12,
    alignItems: 'center',
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  stepDot: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.divider,
    marginBottom: 6,
  },
  dotActive: {
    backgroundColor: COLORS.accent,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotCompleted: {
    backgroundColor: COLORS.accent,
  },
  stepLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.tertiaryText,
  },
  stepLabelActive: {
    color: COLORS.accent,
    fontFamily: FONTS.demi,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentContainer: {
    flex: 1,
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
  buttonContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: COLORS.black,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 17,
    fontFamily: FONTS.demi,
    color: COLORS.white,
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
  waitText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    color: COLORS.tertiaryText,
    fontStyle: 'italic',
  },
});

export default SpiritualFlowScreen;
