import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import LearnHome from '../../screens/learn/LearnHome';
import QuranSurahList from '../../screens/learn/QuranSurahList';
import QuranSurahDetail from '../../screens/learn/QuranSurahDetail';
import DuaCategories from '../../screens/learn/DuaCategories';
import DuaList from '../../screens/learn/DuaList';
import DuaDetail from '../../screens/learn/DuaDetail';

const BOOKMARK_KEYS = {
    VERSES: '@bookmarked_verses',
    DUAS: '@bookmarked_duas',
};

const LearnNavigator = () => {
    // Navigation state
    const [screen, setScreen] = useState('home');
    const [navigationStack, setNavigationStack] = useState([]);

    // Data state
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDua, setSelectedDua] = useState(null);

    // Bookmarks state
    const [bookmarkedVerses, setBookmarkedVerses] = useState([]);
    const [bookmarkedDuas, setBookmarkedDuas] = useState([]);

    useEffect(() => {
        loadBookmarks();
    }, []);

    const loadBookmarks = async () => {
        try {
            const [verses, duas] = await Promise.all([
                AsyncStorage.getItem(BOOKMARK_KEYS.VERSES),
                AsyncStorage.getItem(BOOKMARK_KEYS.DUAS),
            ]);

            if (verses) setBookmarkedVerses(JSON.parse(verses));
            if (duas) setBookmarkedDuas(JSON.parse(duas));
        } catch (error) {
            console.error('Error loading bookmarks:', error);
        }
    };

    const saveBookmarks = async (type, data) => {
        try {
            let key;
            if (type === 'verses') key = BOOKMARK_KEYS.VERSES;
            else if (type === 'duas') key = BOOKMARK_KEYS.DUAS;
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving bookmarks:', error);
        }
    };

    const navigate = (screenName, data = null) => {
        setNavigationStack([...navigationStack, screen]);
        setScreen(screenName);

        if (screenName === 'quran-list') {
            // No extra data needed
        } else if (screenName === 'quran-detail' && data) {
            setSelectedSurah(data);
        } else if (screenName === 'dua-categories') {
            // No extra data needed
        } else if (screenName === 'dua-list' && data) {
            setSelectedCategory(data);
        } else if (screenName === 'dua-detail' && data) {
            setSelectedDua(data);
        }
    };

    const goBack = () => {
        if (navigationStack.length > 0) {
            const previousScreen = navigationStack[navigationStack.length - 1];
            setNavigationStack(navigationStack.slice(0, -1));
            setScreen(previousScreen);

            // Clear relevant state when going back
            if (screen === 'quran-detail') setSelectedSurah(null);
            if (screen === 'dua-list') setSelectedCategory(null);
            if (screen === 'dua-detail') setSelectedDua(null);
        }
    };

    const handleHomeNavigate = (section) => {
        if (section === 'quran') {
            navigate('quran-list');
        } else if (section === 'dua') {
            navigate('dua-categories');
        }
    };

    const handleBookmarkVerse = (verse) => {
        const existingIndex = bookmarkedVerses.findIndex(
            v => v.surahNumber === verse.surahNumber && v.verseNumber === verse.verseNumber
        );

        let newBookmarks;
        if (existingIndex >= 0) {
            // Remove bookmark
            newBookmarks = bookmarkedVerses.filter((_, index) => index !== existingIndex);
        } else {
            // Add bookmark
            newBookmarks = [...bookmarkedVerses, { ...verse, timestamp: Date.now() }];
        }

        setBookmarkedVerses(newBookmarks);
        saveBookmarks('verses', newBookmarks);
    };

    const handleBookmarkDua = (dua) => {
        const existingIndex = bookmarkedDuas.findIndex(d => d.id === dua.id);

        let newBookmarks;
        if (existingIndex >= 0) {
            // Remove bookmark
            newBookmarks = bookmarkedDuas.filter((_, index) => index !== existingIndex);
        } else {
            // Add bookmark
            newBookmarks = [...bookmarkedDuas, { ...dua, timestamp: Date.now() }];
        }

        setBookmarkedDuas(newBookmarks);
        saveBookmarks('duas', newBookmarks);
    };

    const isDuaBookmarked = (duaId) => {
        return bookmarkedDuas.some(d => d.id === duaId);
    };

    // Render the appropriate screen
    const renderScreen = () => {
        switch (screen) {
            case 'home':
                return <LearnHome onNavigate={handleHomeNavigate} />;

            case 'quran-list':
                return (
                    <QuranSurahList
                        onSelectSurah={(surah) => navigate('quran-detail', surah)}
                        onBack={goBack}
                    />
                );

            case 'quran-detail':
                return (
                    <QuranSurahDetail
                        surah={selectedSurah}
                        onBack={goBack}
                        onBookmarkVerse={handleBookmarkVerse}
                        bookmarkedVerses={bookmarkedVerses}
                    />
                );

            case 'dua-categories':
                return (
                    <DuaCategories
                        onSelectCategory={(category) => navigate('dua-list', category)}
                        onBack={goBack}
                    />
                );

            case 'dua-list':
                return (
                    <DuaList
                        category={selectedCategory}
                        onSelectDua={(dua) => navigate('dua-detail', dua)}
                        onBack={goBack}
                        bookmarkedDuas={bookmarkedDuas}
                    />
                );

            case 'dua-detail':
                return (
                    <DuaDetail
                        dua={selectedDua}
                        onBack={goBack}
                        onBookmark={handleBookmarkDua}
                        isBookmarked={isDuaBookmarked(selectedDua?.id)}
                    />
                );

            default:
                return <LearnHome onNavigate={handleHomeNavigate} />;
        }
    };

    return <View style={styles.container}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default LearnNavigator;
