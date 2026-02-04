import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const COLORS = {
    white: '#FFFFFF',
    offWhite: '#FAFAFA',
    black: '#000000',
    secondaryText: '#6B6B6B',
    tertiaryText: '#A0A0A0',
    divider: '#E5E5E5',
    accent: '#92400E',
};

const FONTS = {
    primary: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    medium: Platform.OS === 'ios' ? 'AvenirNext-Medium' : 'sans-serif-medium',
    demi: Platform.OS === 'ios' ? 'AvenirNext-DemiBold' : 'sans-serif-condensed',
    bold: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-bold',
};

const HadithDetail = ({ hadith, collection, onBack, onBookmark, isBookmarked }) => {
    const handleShare = async () => {
        try {
            const shareText = `${hadith.reference}\n\n${hadith.english}\n\n${hadith.arabic ? `${hadith.arabic}\n\n` : ''}Grade: ${hadith.grade}\n\n— Shared from Salah Lock`;
            await Share.share({ message: shareText });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleBookmark = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onBookmark(hadith);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>{hadith.reference}</Text>
                </View>
                <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkButton}>
                    <Ionicons
                        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                        size={24}
                        color={isBookmarked ? COLORS.accent : COLORS.black}
                    />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View entering={FadeIn.duration(400)}>
                    {/* Reference Card */}
                    <View style={styles.referenceCard}>
                        <Text style={styles.referenceTitle}>{hadith.reference}</Text>
                        <Text style={styles.collectionName}>{collection.name}</Text>
                        <View style={styles.metaRow}>
                            <View style={styles.chapterBadge}>
                                <Ionicons name="book-outline" size={14} color={COLORS.secondaryText} />
                                <Text style={styles.chapterText}>{hadith.chapter}</Text>
                            </View>
                            {hadith.grade && (
                                <View style={styles.gradeBadge}>
                                    <Ionicons name="shield-checkmark" size={14} color="#166534" />
                                    <Text style={styles.gradeText}>{hadith.grade}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Arabic Text */}
                    {hadith.arabic && (
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Arabic</Text>
                            <View style={styles.card}>
                                <Text style={styles.arabicText}>{hadith.arabic}</Text>
                            </View>
                        </View>
                    )}

                    {/* English Translation */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>English Translation</Text>
                        <View style={styles.card}>
                            <Text style={styles.englishText}>{hadith.english}</Text>
                        </View>
                    </View>

                    {/* Narrator Chain (if available) */}
                    {hadith.narrator && (
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Narrator</Text>
                            <View style={styles.card}>
                                <Text style={styles.narratorText}>{hadith.narrator}</Text>
                            </View>
                        </View>
                    )}

                    {/* Grade/Authentication */}
                    {hadith.grade && (
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Authentication</Text>
                            <View style={[styles.card, styles.authCard]}>
                                <Ionicons name="shield-checkmark" size={24} color="#166534" />
                                <View style={styles.authContent}>
                                    <Text style={styles.authGrade}>{hadith.grade}</Text>
                                    <Text style={styles.authDescription}>
                                        {hadith.grade === 'Sahih'
                                            ? 'Authentic - This hadith meets the highest standards of authenticity'
                                            : 'Authenticated by scholars'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Share Button */}
                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={handleShare}
                    >
                        <Ionicons name="share-outline" size={20} color={COLORS.white} />
                        <Text style={styles.shareButtonText}>Share Hadith</Text>
                    </TouchableOpacity>

                    <View style={{ height: 100 }} />
                </Animated.View>
            </ScrollView>
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
        fontSize: 16,
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },
    bookmarkButton: {
        marginLeft: 12,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    referenceCard: {
        backgroundColor: COLORS.offWhite,
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
    },
    referenceTitle: {
        fontSize: 20,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginBottom: 6,
    },
    collectionName: {
        fontSize: 15,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 12,
    },
    chapterBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: COLORS.white,
    },
    chapterText: {
        fontSize: 12,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
    },
    gradeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#DCFCE7',
    },
    gradeText: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        color: '#166534',
    },
    section: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        color: COLORS.tertiaryText,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },
    arabicText: {
        fontSize: 22,
        fontFamily: FONTS.primary,
        color: COLORS.black,
        textAlign: 'right',
        lineHeight: 38,
    },
    englishText: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.black,
        lineHeight: 26,
    },
    narratorText: {
        fontSize: 15,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        lineHeight: 24,
    },
    authCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: '#F0FDF4',
        borderColor: '#DCFCE7',
    },
    authContent: {
        flex: 1,
    },
    authGrade: {
        fontSize: 18,
        fontFamily: FONTS.bold,
        color: '#166534',
        marginBottom: 4,
    },
    authDescription: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: '#166534',
        lineHeight: 20,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    shareButtonText: {
        fontSize: 16,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
});

export default HadithDetail;
