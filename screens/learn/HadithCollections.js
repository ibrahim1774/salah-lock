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
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { HADITH_COLLECTIONS } from '../../utils/hadithApi';

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

const CollectionCard = ({ collection, index, onPress }) => {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(collection);
    };

    return (
        <Animated.View entering={FadeIn.delay(index * 50).duration(300)}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePress}
                style={styles.cardContainer}
            >
                <View style={[styles.card, { backgroundColor: collection.color }]}>
                    <View style={styles.cardContent}>
                        <View style={styles.iconContainer}>
                            <Ionicons name={collection.icon} size={32} color={COLORS.white} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitle}>{collection.name}</Text>
                            <Text style={styles.cardArabic}>{collection.arabicName}</Text>
                            <Text style={styles.cardDescription}>{collection.description}</Text>
                            <Text style={styles.cardStats}>{collection.totalHadith.toLocaleString()} Hadiths</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const HadithCollections = ({ onSelectCollection, onBack }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Hadith Collections</Text>
                    <Text style={styles.headerSubtitle}>Authentic narrations</Text>
                </View>
            </View>

            {/* Collections List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {HADITH_COLLECTIONS.map((collection, index) => (
                    <CollectionCard
                        key={collection.id}
                        collection={collection}
                        index={index}
                        onPress={onSelectCollection}
                    />
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
    scrollContent: {
        paddingHorizontal: 20,
    },
    cardContainer: {
        marginBottom: 16,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        minHeight: 120,
    },
    iconContainer: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 20,
        fontFamily: FONTS.bold,
        color: COLORS.white,
        marginBottom: 4,
    },
    cardArabic: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: 'rgba(255,255,255,0.95)',
        marginBottom: 6,
    },
    cardDescription: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 6,
    },
    cardStats: {
        fontSize: 12,
        fontFamily: FONTS.medium,
        color: 'rgba(255,255,255,0.75)',
    },
});

export default HadithCollections;
