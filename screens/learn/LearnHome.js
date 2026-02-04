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

const COLORS = {
    white: '#FFFFFF',
    offWhite: '#FAFAFA',
    black: '#000000',
    secondaryText: '#6B6B6B',
    tertiaryText: '#A0A0A0',
    divider: '#E5E5E5',
    quranGreen: '#10B981',
    duaBlue: '#3B82F6',
};

const FONTS = {
    primary: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    medium: Platform.OS === 'ios' ? 'AvenirNext-Medium' : 'sans-serif-medium',
    demi: Platform.OS === 'ios' ? 'AvenirNext-DemiBold' : 'sans-serif-condensed',
    bold: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-bold',
};

const LearnCard = ({ title, subtitle, stats, icon, gradient, onPress }) => {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            style={styles.cardContainer}
        >
            <Animated.View entering={FadeIn.delay(100).duration(400)}>
                <LinearGradient
                    colors={gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <View style={styles.cardContent}>
                        <View style={styles.iconContainer}>
                            <Ionicons name={icon} size={48} color={COLORS.white} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitle}>{title}</Text>
                            <Text style={styles.cardSubtitle}>{subtitle}</Text>
                            <Text style={styles.cardStats}>{stats}</Text>
                        </View>
                        <View style={styles.arrowContainer}>
                            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
};

const LearnHome = ({ onNavigate }) => {
    return (
        <Animated.View entering={FadeIn} style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Islamic Learning</Text>
                    <Text style={styles.headerSubtitle}>Explore the Quran and Duas</Text>
                </View>

                {/* Main Cards */}
                <View style={styles.cardsContainer}>
                    {/* Quran Card */}
                    <LearnCard
                        title="Quran"
                        subtitle="Read the complete Quran with translations"
                        stats="114 Surahs • 6,236 Ayahs"
                        icon="book"
                        gradient={['#10B981', '#059669', '#047857']}
                        onPress={() => onNavigate('quran')}
                    />

                    {/* Dua Card */}
                    <LearnCard
                        title="Duas"
                        subtitle="Supplications for every occasion"
                        stats="Daily Duas • Special Occasions"
                        icon="hand-left"
                        gradient={['#3B82F6', '#2563EB', '#1E40AF']}
                        onPress={() => onNavigate('dua')}
                    />
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        lineHeight: 24,
    },
    cardsContainer: {
        gap: 16,
    },
    cardContainer: {
        marginBottom: 4,
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
        padding: 24,
        minHeight: 140,
    },
    iconContainer: {
        marginRight: 20,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 26,
        fontFamily: FONTS.bold,
        color: COLORS.white,
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 15,
        fontFamily: FONTS.primary,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 21,
        marginBottom: 8,
    },
    cardStats: {
        fontSize: 13,
        fontFamily: FONTS.medium,
        color: 'rgba(255,255,255,0.7)',
    },
    arrowContainer: {
        marginLeft: 8,
    },
});

export default LearnHome;
