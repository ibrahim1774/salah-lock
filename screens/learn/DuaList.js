import React, { useState } from 'react';
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
import { getDuasByCategory } from '../../data/duas';

const COLORS = {
    white: '#FFFFFF',
    offWhite: '#FAFAFA',
    black: '#000000',
    secondaryText: '#6B6B6B',
    tertiaryText: '#A0A0A0',
    divider: '#E5E5E5',
};

const FONTS = {
    primary: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    medium: Platform.OS === 'ios' ? 'AvenirNext-Medium' : 'sans-serif-medium',
    demi: Platform.OS === 'ios' ? 'AvenirNext-DemiBold' : 'sans-serif-condensed',
    bold: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-bold',
};

const DuaCard = ({ dua, onPress, isBookmarked }) => {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(dua);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePress}
            style={styles.duaCard}
        >
            <View style={styles.duaContent}>
                <Text style={styles.duaTitle}>{dua.title}</Text>
                <Text style={styles.duaArabicPreview} numberOfLines={1}>
                    {dua.arabic}
                </Text>
                <Text style={styles.duaWhen}>{dua.when}</Text>
            </View>

            <View style={styles.duaActions}>
                {isBookmarked && (
                    <Ionicons name="bookmark" size={16} color={COLORS.tertiaryText} />
                )}
                <Ionicons name="chevron-forward" size={20} color={COLORS.tertiaryText} />
            </View>
        </TouchableOpacity>
    );
};

const DuaList = ({ category, onSelectDua, onBack, bookmarkedDuas = [] }) => {
    const duas = getDuasByCategory(category.id);

    const isDuaBookmarked = (duaId) => {
        return bookmarkedDuas.some(d => d.id === duaId);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>{category.name}</Text>
                    <Text style={styles.headerSubtitle}>{duas.length} Duas</Text>
                </View>
            </View>

            {/* Duas List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {duas.map((dua, index) => (
                    <Animated.View
                        key={dua.id}
                        entering={FadeIn.delay(index * 30).duration(300)}
                    >
                        <DuaCard
                            dua={dua}
                            onPress={onSelectDua}
                            isBookmarked={isDuaBookmarked(dua.id)}
                        />
                    </Animated.View>
                ))}
                <View style={{ height: 100 }} />
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
    },
    backButton: {
        marginRight: 16,
    },
    headerTextContainer: {
        flex: 1,
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
        marginTop: 2,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    duaCard: {
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
    duaContent: {
        flex: 1,
    },
    duaTitle: {
        fontSize: 16,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginBottom: 6,
    },
    duaArabicPreview: {
        fontSize: 18,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginBottom: 4,
        textAlign: 'right',
    },
    duaWhen: {
        fontSize: 13,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
    },
    duaActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: 12,
    },
});

export default DuaList;
