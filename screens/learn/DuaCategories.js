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
import { DUA_CATEGORIES, getDuasByCategory } from '../../data/duas';

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

const CategoryCard = ({ category, index, onPress }) => {
    const duaCount = getDuasByCategory(category.id).length;

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(category);
    };

    return (
        <Animated.View entering={FadeIn.delay(index * 50).duration(300)}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handlePress}
                style={[styles.categoryCard, { borderLeftColor: category.color }]}
            >
                <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                    <Ionicons name={category.icon} size={28} color={COLORS.white} />
                </View>

                <View style={styles.categoryContent}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                    <Text style={styles.duaCount}>{duaCount} Duas</Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={COLORS.tertiaryText} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const DuaCategories = ({ onSelectCategory, onBack }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Duas</Text>
                    <Text style={styles.headerSubtitle}>Supplications for every occasion</Text>
                </View>
            </View>

            {/* Categories List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {DUA_CATEGORIES.map((category, index) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        index={index}
                        onPress={onSelectCategory}
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
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.divider,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    categoryContent: {
        flex: 1,
    },
    categoryName: {
        fontSize: 18,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginBottom: 4,
    },
    categoryDescription: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginBottom: 4,
    },
    duaCount: {
        fontSize: 12,
        fontFamily: FONTS.medium,
        color: COLORS.tertiaryText,
    },
});

export default DuaCategories;
