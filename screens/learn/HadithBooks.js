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
import { BUKHARI_BOOKS } from '../../utils/hadithApi';

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

const BookCard = ({ book, onPress }) => {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(book);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePress}
            style={styles.bookCard}
        >
            <View style={styles.bookNumber}>
                <Text style={styles.bookNumberText}>{book.number}</Text>
            </View>

            <View style={styles.bookContent}>
                <Text style={styles.bookTitle}>{book.name}</Text>
                <Text style={styles.bookCount}>{book.hadithCount} Hadiths</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={COLORS.tertiaryText} />
        </TouchableOpacity>
    );
};

const HadithBooks = ({ collection, onSelectBook, onBack }) => {
    // For now, only Bukhari has books. Others can be added later.
    const books = collection.id === 'bukhari' ? BUKHARI_BOOKS : [];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>{collection.name}</Text>
                    <Text style={styles.headerSubtitle}>{collection.arabicName}</Text>
                </View>
            </View>

            {books.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="book-outline" size={64} color={COLORS.divider} />
                    <Text style={styles.emptyText}>Coming Soon</Text>
                    <Text style={styles.emptySubtext}>
                        This collection will be available in a future update
                    </Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {books.map((book, index) => (
                        <Animated.View
                            key={book.number}
                            entering={FadeIn.delay(index * 15).duration(300)}
                        >
                            <BookCard book={book} onPress={onSelectBook} />
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
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 2,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    bookCard: {
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
    bookNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    bookNumberText: {
        fontSize: 14,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
    bookContent: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginBottom: 2,
    },
    bookCount: {
        fontSize: 13,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
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
    },
});

export default HadithBooks;
