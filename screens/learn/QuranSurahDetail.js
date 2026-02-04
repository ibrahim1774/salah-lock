import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Platform,
    Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getSurahWithTranslation } from '../../utils/quranApi';

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

const AyahCard = ({ ayah, surahName, onBookmark, isBookmarked }) => {
    const handleShare = async () => {
        try {
            await Share.share({
                message: `${surahName} - Verse ${ayah.numberInSurah}\n\n${ayah.arabic}\n\n${ayah.translation}\n\n— Shared from Salah Lock`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleBookmark = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onBookmark(ayah);
    };

    return (
        <Animated.View entering={FadeIn.duration(300)} style={styles.ayahCard}>
            {/* Verse Number */}
            <View style={styles.verseNumberContainer}>
                <View style={styles.verseNumber}>
                    <Text style={styles.verseNumberText}>{ayah.numberInSurah}</Text>
                </View>
            </View>

            {/* Arabic Text */}
            <Text style={styles.arabicText}>{ayah.arabic}</Text>

            {/* Translation */}
            <Text style={styles.translationText}>{ayah.translation}</Text>

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
                    <Ionicons
                        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                        size={20}
                        color={isBookmarked ? COLORS.accent : COLORS.secondaryText}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                    <Ionicons name="share-outline" size={20} color={COLORS.secondaryText} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const QuranSurahDetail = ({ surah, onBack, onBookmarkVerse, bookmarkedVerses = [] }) => {
    const [surahData, setSurahData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(18); // Arabic font size

    useEffect(() => {
        loadSurah();
    }, [surah]);

    const loadSurah = async () => {
        try {
            setLoading(true);
            const data = await getSurahWithTranslation(surah.number);
            setSurahData(data);
        } catch (error) {
            console.error('Error loading Surah:', error);
        } finally {
            setLoading(false);
        }
    };

    const increaseFontSize = () => {
        if (fontSize < 28) {
            setFontSize(fontSize + 2);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const decreaseFontSize = () => {
        if (fontSize > 14) {
            setFontSize(fontSize - 2);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const isVerseBookmarked = (verseNumber) => {
        return bookmarkedVerses.some(
            v => v.surahNumber === surah.number && v.verseNumber === verseNumber
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>{surah.englishName}</Text>
                    <Text style={styles.headerSubtitle}>{surah.name}</Text>
                </View>
                <View style={styles.fontControls}>
                    <TouchableOpacity onPress={decreaseFontSize} style={styles.fontButton}>
                        <Text style={styles.fontButtonText}>A-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={increaseFontSize} style={styles.fontButton}>
                        <Text style={styles.fontButtonText}>A+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.accent} />
                    <Text style={styles.loadingText}>Loading Surah...</Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Surah Info Header */}
                    <View style={styles.surahHeader}>
                        <Text style={styles.surahHeaderTitle}>{surah.name}</Text>
                        <Text style={styles.surahHeaderSubtitle}>
                            {surah.englishNameTranslation} • {surah.revelationType}
                        </Text>
                        <Text style={styles.surahHeaderMeta}>
                            {surah.numberOfAyahs} verses
                        </Text>
                    </View>

                    {/* Bismillah (except Surah 9) */}
                    {surah.number !== 1 && surah.number !== 9 && (
                        <View style={styles.bismillahContainer}>
                            <Text style={[styles.bismillahText, { fontSize: fontSize + 4 }]}>
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </Text>
                        </View>
                    )}

                    {/* Verses */}
                    {surahData?.ayahs.map((ayah, index) => (
                        <AyahCard
                            key={ayah.number}
                            ayah={{
                                ...ayah,
                                arabic: ayah.arabic || ayah.text, // Handle different API response formats
                            }}
                            surahName={surah.englishName}
                            onBookmark={() => onBookmarkVerse({
                                surahNumber: surah.number,
                                surahName: surah.englishName,
                                verseNumber: ayah.numberInSurah,
                                arabic: ayah.arabic || ayah.text,
                                translation: ayah.translation,
                            })}
                            isBookmarked={isVerseBookmarked(ayah.numberInSurah)}
                        />
                    ))}

                    <View style={{ height: 100 }} />
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    backButton: {
        marginRight: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },
    headerSubtitle: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 2,
    },
    fontControls: {
        flexDirection: 'row',
        gap: 8,
    },
    fontButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.offWhite,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fontButtonText: {
        fontSize: 14,
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    surahHeader: {
        alignItems: 'center',
        paddingVertical: 24,
        marginBottom: 16,
    },
    surahHeaderTitle: {
        fontSize: 32,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginBottom: 8,
    },
    surahHeaderSubtitle: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        marginBottom: 4,
    },
    surahHeaderMeta: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
    },
    bismillahContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 16,
    },
    bismillahText: {
        fontFamily: FONTS.primary,
        color: COLORS.accent,
        textAlign: 'center',
    },
    ayahCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },
    verseNumberContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    verseNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verseNumberText: {
        fontSize: 14,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
    arabicText: {
        fontSize: 24,
        fontFamily: FONTS.primary,
        color: COLORS.black,
        textAlign: 'right',
        lineHeight: 42,
        marginBottom: 16,
    },
    translationText: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        lineHeight: 26,
        textAlign: 'left',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
    },
    actionButton: {
        padding: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
    },
});

export default QuranSurahDetail;
