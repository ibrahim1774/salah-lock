import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SAMPLE_HADITHS } from '../../utils/hadithApi';

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

const HadithCard = ({ hadith, onPress, isBookmarked }) => {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(hadith);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePress}
            style={styles.hadithCard}
        >
            <View style={styles.hadithHeader}>
                <View style={styles.hadithNumber}>
                    <Text style={styles.hadithNumberText}>{hadith.number}</Text>
                </View>
                <View style={styles.hadithMeta}>
                    <Text style={styles.chapterText}>{hadith.chapter}</Text>
                    {hadith.grade && (
                        <View style={styles.gradeBadge}>
                            <Text style={styles.gradeText}>{hadith.grade}</Text>
                        </View>
                    )}
                </View>
                {isBookmarked && (
                    <Ionicons name="bookmark" size={18} color={COLORS.accent} />
                )}
            </View>

            <Text style={styles.hadithPreview} numberOfLines={3}>
                {hadith.english}
            </Text>

            <View style={styles.hadithFooter}>
                <Text style={styles.referenceText}>{hadith.reference}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryText} />
            </View>
        </TouchableOpacity>
    );
};

const HadithList = ({ collection, book, onSelectHadith, onBack, bookmarkedHadiths = [] }) => {
    // For now, use sample hadiths. In production, fetch from API
    const hadiths = SAMPLE_HADITHS[collection.id] || [];

    const isHadithBookmarked = (hadithNumber) => {
        return bookmarkedHadiths.some(h => h.number === hadithNumber);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>{book.name}</Text>
                    <Text style={styles.headerSubtitle}>
                        {collection.name} • Book {book.number}
                    </Text>
                </View>
            </View>

            {hadiths.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={64} color={COLORS.divider} />
                    <Text style={styles.emptyText}>Coming Soon</Text>
                    <Text style={styles.emptySubtext}>
                        Full hadith content will be available in a future update
                    </Text>
                    <Text style={styles.emptyNote}>
                        Sample Hadith from Sahih Bukhari Book 1:
                    </Text>
                    <View style={styles.sampleBox}>
                        <Text style={styles.sampleText}>
                            "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended..."
                        </Text>
                        <Text style={styles.sampleReference}>- Sahih al-Bukhari 1</Text>
                    </View>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {hadiths.map((hadith, index) => (
                        <Animated.View
                            key={hadith.number}
                            entering={FadeIn.delay(index * 30).duration(300)}
                        >
                            <HadithCard
                                hadith={hadith}
                                onPress={onSelectHadith}
                                isBookmarked={isHadithBookmarked(hadith.number)}
                            />
                        </Animated.View>
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
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 2,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    hadithCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.divider,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    hadithHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    hadithNumber: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    hadithNumberText: {
        fontSize: 14,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
    hadithMeta: {
        flex: 1,
    },
    chapterText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginBottom: 4,
    },
    gradeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#DCFCE7',
    },
    gradeText: {
        fontSize: 11,
        fontFamily: FONTS.bold,
        color: '#166534',
    },
    hadithPreview: {
        fontSize: 15,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        lineHeight: 24,
        marginBottom: 12,
    },
    hadithFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
    },
    referenceText: {
        fontSize: 12,
        fontFamily: FONTS.medium,
        color: COLORS.tertiaryText,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 20,
        fontFamily: FONTS.bold,
        color: COLORS.secondaryText,
        textAlign: 'center',
    },
    emptySubtext: {
        marginTop: 8,
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyNote: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        marginBottom: 12,
    },
    sampleBox: {
        backgroundColor: COLORS.offWhite,
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.accent,
        width: '100%',
    },
    sampleText: {
        fontSize: 15,
        fontFamily: FONTS.primary,
        color: COLORS.black,
        lineHeight: 24,
        marginBottom: 8,
        fontStyle: 'italic',
    },
    sampleReference: {
        fontSize: 13,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
    },
});

export default HadithList;
