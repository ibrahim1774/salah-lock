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
    accent: '#3B82F6',
};

const FONTS = {
    primary: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    medium: Platform.OS === 'ios' ? 'AvenirNext-Medium' : 'sans-serif-medium',
    demi: Platform.OS === 'ios' ? 'AvenirNext-DemiBold' : 'sans-serif-condensed',
    bold: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-bold',
};

const DuaDetail = ({ dua, onBack, onBookmark, isBookmarked }) => {
    const handleShare = async () => {
        try {
            await Share.share({
                message: `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\n— Shared from Salah Lock`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleBookmark = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onBookmark(dua);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {dua.title}
                    </Text>
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
                    {/* Title Card */}
                    <View style={styles.titleCard}>
                        <Text style={styles.duaTitle}>{dua.title}</Text>
                        <View style={styles.whenContainer}>
                            <Ionicons name="time-outline" size={16} color={COLORS.secondaryText} />
                            <Text style={styles.whenText}>{dua.when}</Text>
                        </View>
                    </View>

                    {/* Arabic Text */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Arabic</Text>
                        <View style={styles.card}>
                            <Text style={styles.arabicText}>{dua.arabic}</Text>
                        </View>
                    </View>

                    {/* Transliteration */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Transliteration</Text>
                        <View style={styles.card}>
                            <Text style={styles.transliterationText}>{dua.transliteration}</Text>
                        </View>
                    </View>

                    {/* Translation */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Translation</Text>
                        <View style={styles.card}>
                            <Text style={styles.translationText}>{dua.translation}</Text>
                        </View>
                    </View>

                    {/* Reference */}
                    {dua.reference && (
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Reference</Text>
                            <View style={styles.card}>
                                <Text style={styles.referenceText}>{dua.reference}</Text>
                            </View>
                        </View>
                    )}

                    {/* Benefits */}
                    {dua.benefits && (
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Benefits</Text>
                            <View style={[styles.card, styles.benefitsCard]}>
                                <Ionicons name="star" size={20} color={COLORS.accent} />
                                <Text style={styles.benefitsText}>{dua.benefits}</Text>
                            </View>
                        </View>
                    )}

                    {/* Share Button */}
                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={handleShare}
                    >
                        <Ionicons name="share-outline" size={20} color={COLORS.white} />
                        <Text style={styles.shareButtonText}>Share Dua</Text>
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
        fontSize: 18,
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
    titleCard: {
        backgroundColor: COLORS.offWhite,
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
    },
    duaTitle: {
        fontSize: 22,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginBottom: 12,
    },
    whenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    whenText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
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
        fontSize: 24,
        fontFamily: FONTS.primary,
        color: COLORS.black,
        textAlign: 'right',
        lineHeight: 42,
    },
    transliterationText: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        lineHeight: 26,
        fontStyle: 'italic',
    },
    translationText: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.black,
        lineHeight: 26,
    },
    referenceText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
    },
    benefitsCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: '#EFF6FF',
        borderColor: COLORS.accent,
    },
    benefitsText: {
        flex: 1,
        fontSize: 15,
        fontFamily: FONTS.primary,
        color: COLORS.black,
        lineHeight: 24,
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

export default DuaDetail;
