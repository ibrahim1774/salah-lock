import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getAllSurahs, SURAH_METADATA } from '../../utils/quranApi';

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

const SurahCard = ({ surah, onPress }) => {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(surah);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePress}
            style={styles.surahCard}
        >
            <View style={styles.surahNumber}>
                <Text style={styles.surahNumberText}>{surah.number}</Text>
            </View>

            <View style={styles.surahContent}>
                <View style={styles.surahMain}>
                    <Text style={styles.surahArabic}>{surah.name}</Text>
                    <Text style={styles.surahEnglish}>{surah.englishName}</Text>
                    <Text style={styles.surahMeaning}>{surah.englishNameTranslation}</Text>
                </View>

                <View style={styles.surahMeta}>
                    <View style={[
                        styles.revelationBadge,
                        surah.revelationType === 'Meccan' ? styles.meccanBadge : styles.medinanBadge
                    ]}>
                        <Text style={styles.revelationText}>
                            {surah.revelationType}
                        </Text>
                    </View>
                    <Text style={styles.ayahCount}>{surah.numberOfAyahs} verses</Text>
                </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color={COLORS.tertiaryText} />
        </TouchableOpacity>
    );
};

const QuranSurahList = ({ onSelectSurah, onBack }) => {
    const [surahs, setSurahs] = useState([]);
    const [filteredSurahs, setFilteredSurahs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSurahs();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredSurahs(surahs);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = surahs.filter(surah =>
                surah.englishName.toLowerCase().includes(query) ||
                surah.name.includes(query) ||
                surah.englishNameTranslation.toLowerCase().includes(query) ||
                surah.number.toString().includes(query)
            );
            setFilteredSurahs(filtered);
        }
    }, [searchQuery, surahs]);

    const loadSurahs = async () => {
        try {
            setLoading(true);
            const data = await getAllSurahs();
            setSurahs(data);
            setFilteredSurahs(data);
        } catch (error) {
            console.error('Error loading Surahs:', error);
            // Fallback to local metadata if API fails
            const localSurahs = Object.values(SURAH_METADATA);
            setSurahs(localSurahs);
            setFilteredSurahs(localSurahs);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Quran</Text>
                    <Text style={styles.headerSubtitle}>114 Surahs</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.tertiaryText} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Surahs..."
                    placeholderTextColor={COLORS.tertiaryText}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={COLORS.tertiaryText} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Surah List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.accent} />
                    <Text style={styles.loadingText}>Loading Surahs...</Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {filteredSurahs.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={64} color={COLORS.divider} />
                            <Text style={styles.emptyText}>No Surahs found</Text>
                        </View>
                    ) : (
                        filteredSurahs.map((surah, index) => (
                            <Animated.View
                                key={surah.number}
                                entering={FadeIn.delay(index * 20).duration(300)}
                            >
                                <SurahCard surah={surah} onPress={onSelectSurah} />
                            </Animated.View>
                        ))
                    )}
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
    },
    backButton: {
        marginRight: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },
    headerSubtitle: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.offWhite,
        marginHorizontal: 20,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.black,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    surahCard: {
        flexDirection: 'row',
        alignItems: 'center',
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
    surahNumber: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    surahNumberText: {
        fontSize: 16,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
    surahContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    surahMain: {
        flex: 1,
    },
    surahArabic: {
        fontSize: 20,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        textAlign: 'left',
        marginBottom: 4,
    },
    surahEnglish: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginBottom: 2,
    },
    surahMeaning: {
        fontSize: 13,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
    },
    surahMeta: {
        alignItems: 'flex-end',
        marginLeft: 12,
    },
    revelationBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 6,
    },
    meccanBadge: {
        backgroundColor: '#FEF3C7',
    },
    medinanBadge: {
        backgroundColor: '#DBEAFE',
    },
    revelationText: {
        fontSize: 11,
        fontFamily: FONTS.medium,
        color: COLORS.black,
    },
    ayahCount: {
        fontSize: 12,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
    },
});

export default QuranSurahList;
