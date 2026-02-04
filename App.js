import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Linking,
    NativeModules,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInRight,
    SlideOutLeft,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import LearnNavigator from './components/learn/LearnNavigator';
import Svg, { Circle } from 'react-native-svg';


const { width, height } = Dimensions.get('window');

// --- DESIGN SYSTEM ---
const COLORS = {
    white: '#FFFFFF',
    offWhite: '#FAFAFA',
    black: '#000000',
    secondaryText: '#6B6B6B',
    tertiaryText: '#A0A0A0',
    divider: '#E5E5E5',
    accent: '#10B981', // Premium Green for success
};

const FONTS = {
    primary: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    medium: Platform.OS === 'ios' ? 'AvenirNext-Medium' : 'sans-serif-medium',
    demi: Platform.OS === 'ios' ? 'AvenirNext-DemiBold' : 'sans-serif-condensed',
    bold: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-bold',
    light: Platform.OS === 'ios' ? 'AvenirNext-UltraLight' : 'sans-serif-light',
};

// --- MOCK DATA ---
const PRAYER_TIMES = {
    Fajr: { time: "5:28 AM", arabic: "فجر" },
    Dhuhr: { time: "12:06 PM", arabic: "ظهر" },
    Asr: { time: "2:46 PM", arabic: "عصر" },
    Maghrib: { time: "5:08 PM", arabic: "مغرب" },
    Isha: { time: "6:37 PM", arabic: "عشاء" }
};

// --- HELPERS ---
const getDateKey = (date) => date.toISOString().split('T')[0];

const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

const PRAYER_NAME_ARABIC = {
    Fajr: "فجر",
    Dhuhr: "ظهر",
    Asr: "عصر",
    Maghrib: "مغرب",
    Isha: "عشاء"
};

const GOALS_OPTIONS = [
    { label: 'Pray all 5 daily prayers' },
    { label: 'Deepen my focus (Khushoo)' },
    { label: 'Read Quran more often' },
    { label: 'Wake up for Fajr' },
    { label: 'Limit screen time distractions' },
    { label: 'Build a consistent habit' },
];

const CHALLENGE_OPTIONS = [
    'Work/School schedule',
    'Too tired / Laziness',
    'Forgetfulness',
    'Social Media / Phone distractions',
    'Lack of motivation',
    'Feeling overwhelmed'
];

const STRUGGLE_OPTIONS = [
    'Anxiety or Stress',
    'Feeling disconnected from Allah',
    'Sin or guilt',
    'Difficulty concentrating',
    'Loneliness or Depression',
    'Family or Relationship issues'
];

const CountUp = ({ end, duration = 1000, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [end, duration]);

    return <Text>{count.toLocaleString()}{suffix}</Text>;
};

const ScreenTransition = ({ children, direction = 'forward' }) => {
    return (
        <Animated.View
            entering={direction === 'forward' ? SlideInRight.duration(400) : FadeIn.duration(400)}
            exiting={direction === 'forward' ? SlideOutLeft.duration(400) : FadeOut.duration(400)}
            style={{ flex: 1, backgroundColor: COLORS.white }}
        >
            {children}
        </Animated.View>
    );
};

// --- COMPONENTS ---

const PremiumButton = ({ title, onPress, disabled = false, style = {} }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPressIn = () => {
        scale.value = withSpring(0.96);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const onPressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <Animated.View style={[animatedStyle, { width: '100%' }, style]}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                disabled={disabled}
                style={[
                    styles.button,
                    disabled && { backgroundColor: COLORS.divider }
                ]}
            >
                <Text style={[styles.buttonText, disabled && { color: COLORS.tertiaryText }]}>{title}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const Card = ({ children, style = {}, selected = false }) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPressIn = () => {
        scale.value = withSpring(0.98);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const onPressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <Animated.View style={[
            styles.card,
            style,
            selected && { borderColor: COLORS.black, borderWidth: 1 },
            animatedStyle
        ]}>
            {children}
        </Animated.View>
    );
};

const ProgressBar = ({ current, total }) => {
    const progress = useSharedValue((current / total) * 100);

    useEffect(() => {
        progress.value = withTiming((current / total) * 100, { duration: 400 });
    }, [current, total]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    return (
        <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, animatedStyle]} />
        </View>
    );
};

const Header = ({ current, total, onBack, hideProgress = false }) => {
    return (
        <View style={styles.header}>
            {!hideProgress && <ProgressBar current={current} total={total} />}
            <View style={styles.headerActions}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={COLORS.black} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// --- LOADING BUILD SCREEN COMPONENT ---
const LoadingBuildScreen = ({ onComplete, styles }) => {
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        "building your salah plan...",
        "calculating your prayer times...",
        "personalizing your reminders...",
        "preparing your journey...",
        "almost ready..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 60);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const msgIndex = Math.min(Math.floor(progress / 20), messages.length - 1);
        setMessageIndex(msgIndex);
    }, [progress]);

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
                <View style={styles.progressRing}>
                    <Svg width={200} height={200}>
                        <Circle
                            cx={100}
                            cy={100}
                            r={90}
                            stroke={COLORS.divider}
                            strokeWidth={8}
                            fill="none"
                        />
                        <Circle
                            cx={100}
                            cy={100}
                            r={90}
                            stroke={COLORS.black}
                            strokeWidth={8}
                            fill="none"
                            strokeDasharray={565}
                            strokeDashoffset={565 - (565 * progress / 100)}
                            strokeLinecap="round"
                            transform="rotate(-90 100 100)"
                        />
                    </Svg>
                    <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
                </View>

                <View style={styles.stepDots}>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <View
                            key={i}
                            style={[
                                styles.stepDot,
                                i <= Math.floor(progress / 20) && styles.stepDotActive
                            ]}
                        />
                    ))}
                </View>

                <Text style={styles.buildLoadingText}>{messages[messageIndex]}</Text>
            </View>
        </SafeAreaView>
    );
};

// --- MAIN APP ---

export default function App() {
    // --- STATE ---
    const [screenIndex, setScreenIndex] = useState(0);
    const [isAppReady, setIsAppReady] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const [userData, setUserData] = useState({
        name: '',
        ageRange: '',
        phoneUsage: '',
        prayerFrequency: 5,
        prayerGoal: 5,
        prayerDays: [],
        relationshipStatus: '',
        goals: [],
        challenges: [],
        deeperStruggles: [],
        madhab: '',
        gender: '',
        commitmentLevel: '',
        selectedPlan: 'yearly',
    });
    const [journalEntries, setJournalEntries] = useState([]);
    const [showBeginButton, setShowBeginButton] = useState(false);
    const [completedPrayers, setCompletedPrayers] = useState({}); // { '2026-02-02': { Fajr: true } }
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isPrayerTimesExpanded, setIsPrayerTimesExpanded] = useState(true);
    const [currentDashboardDate, setCurrentDashboardDate] = useState(new Date());
    const [mood, setMood] = useState(null);
    const [reflection, setReflection] = useState('');
    const [expandedEntryId, setExpandedEntryId] = useState(null);

    // --- LOCATION & PRAYER TIMES STATE ---
    const [prayerTimes, setPrayerTimes] = useState(PRAYER_TIMES);
    const [location, setLocation] = useState('New York');
    const [locationMode, setLocationMode] = useState('manual'); // 'gps' or 'manual'
    const [cityQuery, setCityQuery] = useState('');
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [prayerError, setPrayerError] = useState(null);
    const [isChangingLocation, setIsChangingLocation] = useState(false);
    const searchTimeout = useRef(null);

    const [hasScreenTimePermission, setHasScreenTimePermission] = useState(false);
    const [isAppsSelected, setIsAppsSelected] = useState(false);
    const [lockDuration, setLockDuration] = useState(5); // minutes
    const [isCurrentlyLocked, setIsCurrentlyLocked] = useState(false);
    const [unlockedMessage, setUnlockedMessage] = useState(null);
    const pulse = useSharedValue(1);
    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
    }));
    const { SalahLockModule } = NativeModules;
    console.log("All NativeModules:", Object.keys(NativeModules));
    console.log("SalahLockModule:", SalahLockModule);

    const fetchCitySuggestions = (query) => {
        setCityQuery(query);

        // --- DEBOUNCE LOGIC ---
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (query.length < 3) {
            setCitySuggestions([]);
            setShowSuggestions(false);
            return;
        }

        searchTimeout.current = setTimeout(async () => {
            try {
                // Try GeoDB first
                const response = await fetch(
                    `https://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=5`,
                    { timeout: 5000 }
                );

                if (!response.ok) {
                    console.log('GeoDB failed with status:', response.status);
                    throw new Error('GeoDB Error');
                }

                // Verify it's JSON before parsing
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error('Not JSON');
                }

                const data = await response.json();

                if (data.data && data.data.length > 0) {
                    const suggestions = data.data.map(city => ({
                        name: city.name,
                        country: city.country,
                        displayName: `${city.name}, ${city.country}`
                    }));
                    setCitySuggestions(suggestions);
                    setShowSuggestions(true);
                    return;
                }
            } catch (error) {
                console.error('GeoDB failed, trying fallback:', error.message);
            }

            // Fallback to Nominatim (OpenStreetMap)
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
                    { headers: { 'Accept-Language': 'en', 'User-Agent': 'SalahLockApp' } }
                );

                if (!response.ok) throw new Error('Nominatim Error');

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error('Not JSON');
                }

                const data = await response.json();

                if (data && data.length > 0) {
                    const suggestions = data.map(item => {
                        const name = item.address.city || item.address.town || item.address.village || item.display_name.split(',')[0];
                        const country = item.address.country;
                        return {
                            name: name,
                            country: country,
                            displayName: `${name}, ${country}`
                        };
                    }).filter(item => item.name);

                    setCitySuggestions(suggestions);
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error('Fallback search failed:', error.message);
                setShowSuggestions(false);
            }
        }, 500); // 500ms delay
    };

    const fetchPrayerTimesByGPS = async () => {
        setIsFetchingLocation(true);
        setPrayerError(null);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setPrayerError('Permission to access location was denied');
                return false;
            }

            const loc = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = loc.coords;

            const timestamp = Math.floor(Date.now() / 1000);
            const response = await fetch(
                `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=2`
            );
            const data = await response.json();

            if (data.code === 200) {
                const timings = data.data.timings;
                const newTimes = {
                    Fajr: { time: formatTime(timings.Fajr), arabic: PRAYER_NAME_ARABIC.Fajr },
                    Dhuhr: { time: formatTime(timings.Dhuhr), arabic: PRAYER_NAME_ARABIC.Dhuhr },
                    Asr: { time: formatTime(timings.Asr), arabic: PRAYER_NAME_ARABIC.Asr },
                    Maghrib: { time: formatTime(timings.Maghrib), arabic: PRAYER_NAME_ARABIC.Maghrib },
                    Isha: { time: formatTime(timings.Isha), arabic: PRAYER_NAME_ARABIC.Isha },
                };

                setPrayerTimes(newTimes);
                setLocationMode('gps');

                const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
                if (geocode[0]) {
                    setLocation(`${geocode[0].city || geocode[0].region}, ${geocode[0].country}`);
                }
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                return true;
            }
            return false;
        } catch (error) {
            console.error("GPS Error:", error);
            setPrayerError("Could not fetch location");
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return false;
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const fetchPrayerTimesByCity = async (cityName, country) => {
        setIsFetchingLocation(true);
        setPrayerError(null);
        try {
            const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(country)}&method=2`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.code === 200) {
                const timings = data.data.timings;
                const newTimes = {
                    Fajr: { time: formatTime(timings.Fajr), arabic: PRAYER_NAME_ARABIC.Fajr },
                    Dhuhr: { time: formatTime(timings.Dhuhr), arabic: PRAYER_NAME_ARABIC.Dhuhr },
                    Asr: { time: formatTime(timings.Asr), arabic: PRAYER_NAME_ARABIC.Asr },
                    Maghrib: { time: formatTime(timings.Maghrib), arabic: PRAYER_NAME_ARABIC.Maghrib },
                    Isha: { time: formatTime(timings.Isha), arabic: PRAYER_NAME_ARABIC.Isha },
                };

                setPrayerTimes(newTimes);
                setLocation(`${cityName}, ${country}`);
                setLocationMode('manual');
                setCityQuery('');
                setShowSuggestions(false);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                setPrayerError(`Could not find times for ${cityName}. Please try a different city name.`);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        } catch (error) {
            console.error("City Error:", error);
            setPrayerError("Connection error. Please check your internet.");
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const selectCity = async (city) => {
        setCityQuery(city.displayName);
        setShowSuggestions(false);
        setIsChangingLocation(false);
        await fetchPrayerTimesByCity(city.name, city.country);

        // Auto-reschedule prayers when location/times change
        if (hasScreenTimePermission && isAppsSelected) {
            syncPrayerSchedules();
        }
    };

    // --- SCREEN TIME HELPERS ---
    const handleRequestScreenTime = async () => {
        try {
            const success = await SalahLockModule.requestScreenTimePermissions();
            setHasScreenTimePermission(success);
            if (success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
            return success;
        } catch (e) {
            console.error("Screen Time Permission Error:", e);
            return false;
        }
    };

    const handleSelectApps = async () => {
        try {
            const result = await SalahLockModule.selectApps();
            // result is true when Done is pressed, false when Cancel is pressed
            if (result) {
                const selected = await SalahLockModule.hasSelectedApps();
                setIsAppsSelected(selected);
                if (selected) {
                    syncPrayerSchedules();
                }
            }
        } catch (e) {
            console.error("Select Apps Error:", e);
        }
    };

    const handleSaveJournalEntry = async () => {
        if (!reflection.trim()) return;

        const newEntry = {
            id: Date.now().toString(),
            text: reflection,
            timestamp: new Date().toISOString(),
        };

        const updatedEntries = [newEntry, ...journalEntries];
        setJournalEntries(updatedEntries);
        setReflection('');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        try {
            await AsyncStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
        } catch (e) {
            console.error("Save Journal Error:", e);
        }
    };

    const handleDeleteJournalEntry = async (id) => {
        Alert.alert(
            "Delete Reflection",
            "Are you sure you want to delete this journal entry?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const updatedEntries = journalEntries.filter(e => e.id !== id);
                        setJournalEntries(updatedEntries);
                        try {
                            await AsyncStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        } catch (e) {
                            console.error("Delete Journal Error:", e);
                        }
                    }
                }
            ]
        );
    };

    const syncPrayerSchedules = async () => {
        if (!hasScreenTimePermission || !isAppsSelected) return;

        try {
            // Convert prayer times to "HH:mm" 24h format for the native scheduler
            const rawTimes = {};
            Object.entries(prayerTimes).forEach(([name, data]) => {
                // Convert "5:28 AM" -> "05:28", "12:06 PM" -> "12:06", "5:08 PM" -> "17:08"
                const [time, ampm] = data.time.split(' ');
                let [hours, minutes] = time.split(':');
                let h = parseInt(hours, 10);
                if (ampm === 'PM' && h < 12) h += 12;
                if (ampm === 'AM' && h === 12) h = 0;
                rawTimes[name] = `${h.toString().padStart(2, '0')}:${minutes}`;
            });

            await SalahLockModule.schedulePrayerLocks(rawTimes, lockDuration);
            console.log("Schedules synced with duration:", lockDuration);
        } catch (e) {
            console.error("Schedule Sync Error:", e);
        }
    };

    const handleImmediateLock = async () => {
        if (!isAppsSelected) {
            Alert.alert(
                "No Apps Selected",
                "Please select apps to block first.",
                [{ text: "OK" }]
            );
            return;
        }
        try {
            await SalahLockModule.testBlockApps();
            setIsCurrentlyLocked(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {
            console.error("Immediate Lock Error:", e);
            Alert.alert(
                "Blocking Failed",
                "Could not block apps. Please try again.",
                [{ text: "OK" }]
            );
        }
    };

    const handleIHavePrayed = async () => {
        try {
            await SalahLockModule.testUnblockApps();
            setIsCurrentlyLocked(false);
            setUnlockedMessage(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Mark the current prayer as complete
            const dateKey = getDateKey(new Date());
            const currentPrayer = getCurrentPrayer();
            if (currentPrayer) {
                togglePrayerCompletion(dateKey, currentPrayer);
            }

            // Auto-hide success message after 3 seconds
            setTimeout(() => {
                setUnlockedMessage(false);
            }, 3000);
        } catch (e) {
            console.error("Unlock Error:", e);
        }
    };

    const handleImmediateUnlock = async () => {
        try {
            await SalahLockModule.testUnblockApps();
            setIsCurrentlyLocked(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {
            console.error("Immediate Unlock Error:", e);
        }
    };

    // --- TIMERS ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const checkLockStatus = async () => {
            if (SalahLockModule?.checkIsShieldActive) {
                try {
                    const active = await SalahLockModule.checkIsShieldActive();
                    if (active !== isCurrentlyLocked) {
                        setIsCurrentlyLocked(active);
                    }
                } catch (e) {
                    console.error("Check Lock Status Error:", e);
                }
            }
        };

        checkLockStatus();
        const interval = setInterval(checkLockStatus, 5000); // Check every 5s
        return () => clearInterval(interval);
    }, [isCurrentlyLocked]);

    useEffect(() => {
        if (screenIndex === 0) {
            const timer = setTimeout(() => {
                setShowBeginButton(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [screenIndex]);

    useEffect(() => {
        const loadJournal = async () => {
            try {
                const saved = await AsyncStorage.getItem('journal_entries');
                if (saved) setJournalEntries(JSON.parse(saved));
            } catch (e) {
                console.error("Load Journal Error:", e);
            }
        };
        loadJournal();
    }, []);

    // Load completed prayers from storage
    useEffect(() => {
        const loadCompletedPrayers = async () => {
            try {
                const saved = await AsyncStorage.getItem('completed_prayers');
                if (saved) setCompletedPrayers(JSON.parse(saved));
            } catch (e) {
                console.error("Load Prayers Error:", e);
            }
        };
        loadCompletedPrayers();
    }, []);
    useEffect(() => {
        if (screenIndex === 0 && showBeginButton) {
            pulse.value = withRepeat(
                withTiming(1.05, { duration: 1000 }),
                -1,
                true
            );
        } else {
            pulse.value = 1;
        }

    }, [screenIndex, showBeginButton]);

    useEffect(() => {
        let isMounted = true;
        const initPrayerFetch = async () => {
            if (screenIndex === 24) {
                // We are on the loading screen, start fetching
                const success = await fetchPrayerTimesByGPS();
                if (isMounted) {
                    if (success) {
                        next();
                    } else {
                        // If failed, go back to previous screen so user can retry or see error
                        back();
                    }
                }
            }
        };
        initPrayerFetch();
        return () => { isMounted = false; };
    }, [screenIndex]);

    // --- NAVIGATION ---
    const next = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setScreenIndex(prev => prev + 1);
    };

    const back = () => {
        if (screenIndex > 0) {
            setScreenIndex(prev => prev - 1);
        }
    };

    const updateData = (key, value) => {
        setUserData(prev => ({ ...prev, [key]: value }));
    };

    const togglePrayerCompletion = async (dateKey, prayerName) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Vibration.vibrate(50);
        setCompletedPrayers(prev => {
            const day = prev[dateKey] || {};
            const updated = {
                ...prev,
                [dateKey]: {
                    ...day,
                    [prayerName]: !day[prayerName]
                }
            };
            // Persist to AsyncStorage
            AsyncStorage.setItem('completed_prayers', JSON.stringify(updated)).catch(e => {
                console.error("Save Prayers Error:", e);
            });
            return updated;
        });
    };

    const toggleGoal = (goalLabel) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setUserData(prev => {
            const currentGoals = prev.goals || [];
            const newGoals = currentGoals.includes(goalLabel)
                ? currentGoals.filter(g => g !== goalLabel)
                : [...currentGoals, goalLabel].slice(0, 3); // Max 3
            return { ...prev, goals: newGoals };
        });
    };

    const toggleStruggle = (struggle) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setUserData(prev => {
            const current = prev.deeperStruggles || [];

            // If selecting "None", clear everything else
            if (struggle === 'None') {
                return { ...prev, deeperStruggles: ['None'] };
            }

            // If selecting something else, assume "None" should be removed
            let newStruggles;
            if (current.includes(struggle)) {
                newStruggles = current.filter(s => s !== struggle);
            } else {
                const withoutNone = current.filter(s => s !== 'None');
                newStruggles = [...withoutNone, struggle];
            }
            return { ...prev, deeperStruggles: newStruggles };
        });
    };

    // --- HELPER FUNCTIONS ---

    function parseTimeToMins(timeStr) {
        if (!timeStr) return 0;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    }

    // Get the current prayer (the most recent one that has started)
    function getCurrentPrayer() {
        const now = currentTime.getHours() * 60 + currentTime.getMinutes();
        const pTimes = Object.keys(prayerTimes).map(name => ({
            name,
            mins: parseTimeToMins(prayerTimes[name].time)
        })).sort((a, b) => a.mins - b.mins);

        // Find the most recent prayer that has started
        let current = null;
        for (let i = pTimes.length - 1; i >= 0; i--) {
            if (pTimes[i].mins <= now) {
                current = pTimes[i].name;
                break;
            }
        }
        // If no prayer has started today yet, return the last prayer (Isha from yesterday context)
        if (!current) {
            current = pTimes[pTimes.length - 1].name;
        }
        return current;
    }

    function findNextPrayer() {
        const now = currentTime.getHours() * 60 + currentTime.getMinutes();
        const pTimes = Object.keys(prayerTimes).map(name => ({
            name,
            mins: parseTimeToMins(prayerTimes[name].time)
        })).sort((a, b) => a.mins - b.mins);

        let next = pTimes.find(p => p.mins > now);
        if (!next) {
            next = pTimes[0]; // Next is Fajr tomorrow
        }

        const diffMins = next.mins > now ? next.mins - now : (24 * 60 - now) + next.mins;
        const h = Math.floor(diffMins / 60);
        const m = diffMins % 60;
        const s = 60 - currentTime.getSeconds();

        let countdownStr = "in ";
        if (h > 0) countdownStr += `${h}h `;
        if (m > 0 || h > 0) countdownStr += `${m}m `;
        countdownStr += `${s}s`;

        return {
            name: next.name,
            time: prayerTimes[next.name].time,
            countdown: countdownStr,
            progress: 1 - (diffMins / 300) // Mock progress (last 5 hours)
        };
    }

    function renderNextPrayerCard() {
        const nextPrayer = findNextPrayer();
        return (
            <Card style={styles.nextPrayerCardMain}>
                <View style={styles.nextCardStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.nextCardLabel}>NEXT PRAYER</Text>
                </View>
                <Text style={styles.nextCardName}>{nextPrayer.name}</Text>
                <Text style={styles.nextCardCountdown}>{nextPrayer.countdown}</Text>
                <View style={styles.cardProgressBarContainer}>
                    <View style={[styles.cardProgressBar, { width: `${Math.max(10, nextPrayer.progress * 100)}%` }]} />
                </View>
            </Card>
        );
    }

    function renderHome() {
        const dateKey = getDateKey(currentDashboardDate);

        return (
            <Animated.View entering={FadeIn} style={styles.dashboardContent}>
                <View style={styles.dashHeader}>
                    <View>
                        <Text style={styles.dashTitleMain}>Salah Lock</Text>
                        <Text style={styles.dashSubtitle}>Digital wellness through mindful prayer</Text>
                        <Text style={styles.dashDateText}>{currentTime.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
                    </View>
                </View>

                {/* Locked Banner */}
                {isCurrentlyLocked && (
                    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.lockedBanner}>
                        <Text style={styles.lockedBannerText}>Apps are locked for prayer time</Text>
                        <TouchableOpacity style={styles.iHavePrayedButton} onPress={handleIHavePrayed}>
                            <Text style={styles.iHavePrayedButtonText}>I Have Prayed</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Success Message Overlay */}
                {unlockedMessage && (
                    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.successOverlay}>
                        <View style={styles.successCard}>
                            <Ionicons name="checkmark-circle" size={80} color={COLORS.accent} />
                            <Text style={styles.successTitle}>Apps unlocked!</Text>
                            <Text style={styles.successSubtitle}>May Allah accept your prayer 🤲</Text>
                            <View style={styles.quranVerseContainer}>
                                <Text style={styles.quranVerse}>"Indeed, prayer prohibits immorality and wrongdoing."</Text>
                                <Text style={styles.quranCitation}>— Quran 29:45</Text>
                            </View>
                        </View>
                    </Animated.View>
                )}

                {/* Next Prayer Card */}
                {renderNextPrayerCard()}

                {/* Today's Prayers Section */}
                <TouchableOpacity
                    style={styles.expandableHeader}
                    onPress={() => setIsPrayerTimesExpanded(!isPrayerTimesExpanded)}
                >
                    <Text style={styles.sectionTitle}>Today's Prayer Times</Text>
                    <Ionicons name={isPrayerTimesExpanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.secondaryText} />
                </TouchableOpacity>

                {isPrayerTimesExpanded && (
                    <Animated.View entering={FadeIn}>
                        <View style={styles.dateSelector}>
                            <TouchableOpacity onPress={() => setCurrentDashboardDate(new Date(currentDashboardDate.getTime() - 86400000))}>
                                <Ionicons name="arrow-back-circle-outline" size={28} color={COLORS.black} />
                            </TouchableOpacity>
                            <Text style={styles.currentDateKey}>{dateKey === getDateKey(new Date()) ? "Today" : dateKey}</Text>
                            <TouchableOpacity onPress={() => setCurrentDashboardDate(new Date(currentDashboardDate.getTime() + 86400000))}>
                                <Ionicons name="arrow-forward-circle-outline" size={28} color={COLORS.black} />
                            </TouchableOpacity>
                        </View>
                        {Object.entries(prayerTimes).map(([name, data]) => {
                            const isCompleted = completedPrayers[dateKey]?.[name];
                            return (
                                <View key={name} style={[styles.prayerCardDetailed, isCompleted && { opacity: 0.6 }]}>
                                    <View style={styles.prayerCardInfo}>
                                        <Text style={styles.prayerNameDetailed}>{name}</Text>
                                        <Text style={styles.prayerArabicDetailed}>{data.arabic}</Text>
                                    </View>
                                    <Text style={styles.prayerTimeDetailed}>{data.time}</Text>
                                    <TouchableOpacity onPress={() => togglePrayerCompletion(dateKey, name)}>
                                        <Ionicons
                                            name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
                                            size={32}
                                            color={isCompleted ? COLORS.accent : COLORS.divider}
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </Animated.View>
                )}

                {/* Active Lock Status (I Prayed Button) */}
                {isCurrentlyLocked && (
                    <Animated.View entering={FadeIn} style={styles.activeLockBanner}>
                        <View style={styles.activeLockIconContainer}>
                            <Ionicons name="lock-closed" size={24} color={COLORS.white} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={styles.activeLockTitle}>Apps are locked for prayer</Text>
                            <Text style={styles.activeLockSubtitle}>Focus on your connection with Allah</Text>
                        </View>
                        <TouchableOpacity style={styles.unlockNowButton} onPress={handleImmediateUnlock}>
                            <Text style={styles.unlockNowButtonText}>I Prayed</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Lock Apps Card */}
                <Card style={styles.featureCard}>
                    <TouchableOpacity onPress={handleSelectApps} style={styles.featureCardContent}>
                        <View style={[styles.featureIconContainer, isAppsSelected && { backgroundColor: '#ECFDF5' }]}>
                            <Ionicons
                                name={isAppsSelected ? "checkmark-circle" : "lock-closed-outline"}
                                size={24}
                                color={isAppsSelected ? COLORS.accent : COLORS.black}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={styles.featureTitle}>Lock Apps for Prayers</Text>
                            <Text style={styles.featureSubtitle}>
                                {isAppsSelected ? "✓ Automatic blocking enabled" : "Tap to select apps to block"}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.tertiaryText} />
                    </TouchableOpacity>
                </Card>

                {/* Calendar Section */}
                <View style={styles.calendarContainer}>
                    <View style={styles.calendarHeader}>
                        <Text style={styles.calendarMonth}>February 2026</Text>
                        <View style={styles.calendarNav}>
                            <TouchableOpacity><Ionicons name="chevron-back" size={20} color={COLORS.black} /></TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 20 }}><Ionicons name="chevron-forward" size={20} color={COLORS.black} /></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.weekGrid}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <Text key={i} style={styles.weekDayLabel}>{d}</Text>)}
                        {Array.from({ length: 7 }).map((_, i) => (
                            <View key={i} style={styles.calendarDay}>
                                <View style={[styles.dayCircleMini, i === 1 && styles.dayCircleActive]}>
                                    <Text style={[styles.dayTextMini, i === 1 && { color: COLORS.white }]}>{i + 1}</Text>
                                </View>
                                {i < 1 && <View style={styles.completionDot} />}
                            </View>
                        ))}
                    </View>
                </View>

            </Animated.View>
        );
    }

    function renderProgress() {
        // Calculate real statistics from completedPrayers
        const calculateStats = () => {
            let totalPrayers = 0;
            let currentStreak = 0;
            let weeklyPrayers = 0;

            const today = new Date();
            const todayKey = getDateKey(today);

            // Get start of current week (Sunday)
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const weekStartKey = getDateKey(startOfWeek);

            // Count total prayers and weekly prayers
            Object.entries(completedPrayers).forEach(([dateKey, prayers]) => {
                const dayCount = Object.values(prayers).filter(Boolean).length;
                totalPrayers += dayCount;

                // Check if date is in current week
                if (dateKey >= weekStartKey && dateKey <= todayKey) {
                    weeklyPrayers += dayCount;
                }
            });

            // Calculate streak (consecutive days with all 5 prayers)
            let checkDate = new Date(today);
            while (true) {
                const dateKey = getDateKey(checkDate);
                const dayPrayers = completedPrayers[dateKey] || {};
                const completedCount = Object.values(dayPrayers).filter(Boolean).length;

                if (completedCount === 5) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else if (dateKey === todayKey && completedCount > 0) {
                    // Today is in progress, check yesterday
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }

            // Calculate weekly percentage (max 35 prayers per week)
            const maxWeeklyPrayers = 35;
            const weeklyPercentage = Math.round((weeklyPrayers / maxWeeklyPrayers) * 100);

            return { totalPrayers, currentStreak, weeklyPrayers, weeklyPercentage };
        };

        const stats = calculateStats();

        // Define weekly milestones
        const weeklyMilestones = [
            { id: 'w1', title: 'Getting Started', desc: '10 prayers this week', target: 10, icon: 'flash-outline', color: '#FF9500' },
            { id: 'w2', title: 'Building Momentum', desc: '21 prayers this week', target: 21, icon: 'trending-up-outline', color: '#FF6B6B' },
            { id: 'w3', title: 'Almost There', desc: '28 prayers this week', target: 28, icon: 'star-outline', color: '#5856D6' },
            { id: 'w4', title: 'Perfect Week', desc: '35 prayers this week', target: 35, icon: 'trophy-outline', color: COLORS.accent },
        ];

        // Define streak milestones (in days with all 5 prayers)
        const streakMilestones = [
            { id: 's1', title: '2-Week Warrior', desc: '14-day streak (5 prayers/day)', target: 14, icon: 'flame-outline', color: '#FF9500' },
            { id: 's2', title: 'Monthly Master', desc: '30-day streak (5 prayers/day)', target: 30, icon: 'medal-outline', color: '#FFD700' },
            { id: 's3', title: 'Quarterly Champion', desc: '90-day streak (5 prayers/day)', target: 90, icon: 'ribbon-outline', color: '#5856D6' },
            { id: 's4', title: 'Half-Year Hero', desc: '180-day streak (5 prayers/day)', target: 180, icon: 'diamond-outline', color: COLORS.accent },
        ];

        const renderMilestone = (milestone, current, isStreak = false) => {
            const isUnlocked = current >= milestone.target;
            const progress = Math.min(current / milestone.target, 1);

            return (
                <Card key={milestone.id} style={[styles.milestoneCard, !isUnlocked && styles.milestoneCardLocked]}>
                    <View style={[styles.milestoneIconContainer, { backgroundColor: milestone.color + '20' }]}>
                        <Ionicons name={milestone.icon} size={24} color={milestone.color} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                        <Text style={styles.milestoneDesc}>{milestone.desc}</Text>
                        {!isUnlocked && (
                            <View style={styles.milestoneProgress}>
                                <View style={styles.milestoneProgressBar}>
                                    <View style={[styles.milestoneProgressFill, { width: `${progress * 100}%`, backgroundColor: milestone.color }]} />
                                </View>
                                <Text style={styles.milestoneProgressText}>
                                    {current} / {milestone.target} {isStreak ? 'days' : 'prayers'}
                                </Text>
                            </View>
                        )}
                    </View>
                    {isUnlocked ? (
                        <View style={styles.unlockedBadge}>
                            <Text style={styles.unlockedBadgeText}>Unlocked</Text>
                        </View>
                    ) : (
                        <Ionicons name="lock-closed-outline" size={20} color={COLORS.tertiaryText} />
                    )}
                </Card>
            );
        };

        return (
            <Animated.View entering={FadeIn} style={styles.dashboardContent}>
                <Text style={styles.dashTitleMain}>Your Progress</Text>
                <Card style={styles.progressMainCard}>
                    <Text style={styles.progressStatCount}><CountUp end={stats.totalPrayers} duration={2000} /></Text>
                    <Text style={styles.progressStatLabel}>TOTAL PRAYERS COMPLETED</Text>
                    <View style={styles.progressMiniStats}>
                        <View style={styles.miniStatItem}>
                            <Text style={styles.miniStatValue}>{stats.currentStreak}</Text>
                            <Text style={styles.miniStatLabel}>Day Streak</Text>
                        </View>
                        <View style={styles.miniStatDivider} />
                        <View style={styles.miniStatItem}>
                            <Text style={styles.miniStatValue}>{stats.weeklyPercentage}%</Text>
                            <Text style={styles.miniStatLabel}>This Week</Text>
                        </View>
                    </View>
                </Card>

                <View style={styles.milestoneSection}>
                    <Text style={styles.milestoneSectionTitle}>Weekly Milestones</Text>
                    {weeklyMilestones.map(m => renderMilestone(m, stats.weeklyPrayers, false))}
                </View>

                <View style={styles.milestoneSection}>
                    <Text style={styles.milestoneSectionTitle}>Streak Milestones</Text>
                    {streakMilestones.map(m => renderMilestone(m, stats.currentStreak, true))}
                </View>
            </Animated.View>
        );
    }

    function renderLearn() {
        return <LearnNavigator />;
    }

    function renderReflect() {
        return (
            <Animated.View entering={FadeIn} style={styles.dashboardContent}>
                <Text style={styles.dashTitleMain}>Reflect</Text>

                {/* Mood Tracker */}
                <Text style={styles.sectionTitle}>How are you feeling today?</Text>
                <View style={styles.moodGrid}>
                    {['😊', '😌', '😐', '😔', '😢'].map((emoji, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.moodItem, mood === i && styles.moodItemSelected]}
                            onPress={() => {
                                setMood(i);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                        >
                            <Text style={styles.moodEmoji}>{emoji}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Journal Prompt */}
                <Card style={styles.journalCard}>
                    <Text style={styles.journalPromptLabel}>TODAY'S PROMPT</Text>
                    <Text style={styles.journalPrompt}>What are you grateful for today?</Text>
                    <TextInput
                        style={styles.journalInput}
                        placeholder="Write your thoughts..."
                        placeholderTextColor={COLORS.tertiaryText}
                        multiline
                        value={reflection}
                        onChangeText={setReflection}
                    />
                    <View style={styles.journalActions}>
                        <TouchableOpacity
                            style={styles.clearJournalButton}
                            onPress={() => setReflection('')}
                        >
                            <Text style={styles.clearJournalText}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveJournalButton}
                            onPress={handleSaveJournalEntry}
                        >
                            <Text style={styles.saveJournalText}>Save Reflection</Text>
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* Recent Reflections */}
                <View style={styles.historyHeader}>
                    <Text style={styles.sectionTitle}>Recent Reflections</Text>
                    <Text style={styles.entryCount}>{journalEntries.length} entries</Text>
                </View>

                {journalEntries.length === 0 ? (
                    <View style={styles.emptyStateContainer}>
                        <Ionicons name="book-outline" size={48} color={COLORS.divider} />
                        <Text style={styles.emptyStateText}>No reflections yet</Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.journalHistoryScroll}>
                        {journalEntries.map((entry) => {
                            const isExpanded = expandedEntryId === entry.id;
                            const dateStr = new Date(entry.timestamp).toLocaleDateString(undefined, {
                                month: 'short', day: 'numeric', year: 'numeric'
                            });
                            const timeStr = new Date(entry.timestamp).toLocaleTimeString(undefined, {
                                hour: 'numeric', minute: '2-digit'
                            });

                            return (
                                <TouchableOpacity
                                    key={entry.id}
                                    style={styles.journalEntryCard}
                                    onPress={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.journalEntryHeader}>
                                        <Text style={styles.journalEntryTimestamp}>{dateStr} at {timeStr}</Text>
                                        <TouchableOpacity onPress={() => handleDeleteJournalEntry(entry.id)}>
                                            <Ionicons name="trash-outline" size={16} color={COLORS.secondaryText} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text
                                        style={[styles.journalEntryPreview, isExpanded && styles.journalEntryFullText]}
                                        numberOfLines={isExpanded ? undefined : 2}
                                    >
                                        {entry.text}
                                    </Text>
                                    {!isExpanded && entry.text.length > 80 && (
                                        <Text style={styles.readMoreText}>Read more</Text>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                        <View style={{ height: 40 }} />
                    </ScrollView>
                )}
            </Animated.View>
        );
    }

    function renderLocationSearch() {
        return (
            <Animated.View entering={FadeIn} style={[styles.fullScreenSearch, { paddingTop: 60 }]}>
                <View style={styles.searchHeader}>
                    <TouchableOpacity onPress={() => setIsChangingLocation(false)} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.searchHeaderTitle}>Change Location</Text>
                    <View style={{ width: 60 }} />
                </View>

                <View style={styles.searchInputWrapperLarge}>
                    <Ionicons name="search" size={20} color={COLORS.tertiaryText} style={styles.searchIconLarge} />
                    <TextInput
                        style={styles.citySearchInputLarge}
                        placeholder="Search for a city..."
                        value={cityQuery}
                        onChangeText={fetchCitySuggestions}
                        placeholderTextColor={COLORS.tertiaryText}
                        autoFocus
                    />
                </View>

                {cityQuery.length < 2 ? (
                    <View style={styles.emptySearchContainer}>
                        <Ionicons name="search-outline" size={80} color={COLORS.divider} />
                        <Text style={styles.emptySearchText}>Search for any city in the world</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.suggestionsListFull}>
                        {citySuggestions.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.suggestionItemLarge}
                                onPress={() => selectCity(item)}
                            >
                                <Ionicons name="location-outline" size={20} color={COLORS.secondaryText} />
                                <Text style={styles.suggestionTextLarge}>{item.displayName}</Text>
                                <Ionicons name="chevron-forward" size={16} color={COLORS.tertiaryText} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </Animated.View>
        );
    }

    function renderSettings() {
        return (
            <Animated.View entering={FadeIn} style={styles.dashboardContent}>
                <Text style={styles.dashTitleMain}>Settings</Text>

                {/* App Lock Section */}
                <View style={styles.settingsSection}>
                    <Text style={styles.settingsSectionTitle}>APP BLOCKING</Text>
                    <Card style={styles.settingsSectionCard}>
                        <TouchableOpacity style={styles.settingsItemDetailed} onPress={handleSelectApps}>
                            <View style={styles.settingsItemLeftDetailed}>
                                <View style={styles.settingsIconContainer}>
                                    <Ionicons name="apps-outline" size={20} color={COLORS.black} />
                                </View>
                                <Text style={styles.settingsItemNameDetailed}>Selected Apps</Text>
                            </View>
                            <View style={styles.settingsItemRightDetailed}>
                                <Text style={styles.settingsItemValueDetailed}>
                                    {isAppsSelected ? "Modified" : "None"}
                                </Text>
                                <Ionicons name="chevron-forward" size={18} color={COLORS.tertiaryText} />
                            </View>
                        </TouchableOpacity>

                        <View style={[styles.settingsItemDetailed, { flexDirection: 'column', alignItems: 'flex-start', paddingVertical: 20 }]}>
                            <View style={[styles.settingsItemLeftDetailed, { marginBottom: 15, width: '100%' }]}>
                                <View style={styles.settingsIconContainer}>
                                    <Ionicons name="timer-outline" size={20} color={COLORS.black} />
                                </View>
                                <Text style={styles.settingsItemNameDetailed}>Lock Duration</Text>
                            </View>
                            <View style={[styles.durationSelector, { width: '100%', justifyContent: 'space-between', paddingHorizontal: 5 }]}>
                                {[5, 10, 15, 20].map((d) => (
                                    <TouchableOpacity
                                        key={d}
                                        style={[styles.durationOption, lockDuration === d && styles.durationOptionSelected, { flex: 1, height: 44 }]}
                                        onPress={() => {
                                            setLockDuration(d);
                                            syncPrayerSchedules();
                                        }}
                                    >
                                        <Text style={[styles.durationText, lockDuration === d && styles.durationTextSelected]}>{d}m</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.settingsItemDetailed}>
                            <TouchableOpacity style={styles.testLockButton} onPress={handleImmediateLock}>
                                <Ionicons name="play-outline" size={18} color={COLORS.black} />
                                <Text style={styles.testLockButtonText}>Test Blocking Now</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>

                {/* Prayer Settings */}
                <View style={styles.settingsSection}>
                    <Text style={styles.settingsSectionTitle}>PRAYER SETTINGS</Text>
                    <Card style={styles.settingsSectionCard}>
                        <View style={styles.settingsItemDetailed}>
                            <View style={styles.settingsItemLeftDetailed}>
                                <View style={styles.settingsIconContainer}>
                                    <Ionicons name="location-outline" size={20} color={COLORS.black} />
                                </View>
                                <View>
                                    <Text style={styles.settingsItemNameDetailed}>Current Location</Text>
                                    <Text style={styles.settingsLocationSubtitle}>{location}</Text>
                                </View>
                            </View>
                            <View style={[styles.modeBadge, { backgroundColor: locationMode === 'gps' ? '#E0F2FE' : '#F3F4F6' }]}>
                                <Text style={[styles.modeBadgeText, { color: locationMode === 'gps' ? '#0369A1' : '#4B5563' }]}>
                                    {locationMode === 'gps' ? '📍 GPS' : '🔍 Manual'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.locationControls}>
                            <TouchableOpacity
                                style={[styles.gpsButton, isFetchingLocation && styles.disabledButton]}
                                onPress={fetchPrayerTimesByGPS}
                                disabled={isFetchingLocation}
                            >
                                <Ionicons name="navigate-outline" size={18} color={COLORS.white} />
                                <Text style={styles.gpsButtonText}>
                                    {isFetchingLocation ? 'Locating...' : 'Use Current Location'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.changeLocationButton}
                                onPress={() => {
                                    setCityQuery('');
                                    setCitySuggestions([]);
                                    setIsChangingLocation(true);
                                }}
                            >
                                <Ionicons name="search-outline" size={18} color={COLORS.black} />
                                <Text style={styles.changeLocationButtonText}>Change City</Text>
                            </TouchableOpacity>

                            {prayerError && <Text style={styles.errorText}>{prayerError}</Text>}
                        </View>

                    </Card>
                </View>

                {/* Premium */}
                <View style={styles.settingsSection}>
                    <Text style={styles.settingsSectionTitle}>PREMIUM</Text>
                    <Card style={styles.settingsSectionCard}>
                        <TouchableOpacity style={styles.settingsItemDetailed}>
                            <View style={styles.settingsItemLeftDetailed}>
                                <View style={styles.settingsIconContainer}>
                                    <Ionicons name="star-outline" size={20} color={COLORS.black} />
                                </View>
                                <Text style={styles.settingsItemNameDetailed}>Upgrade to Premium</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={COLORS.tertiaryText} />
                        </TouchableOpacity>
                    </Card>
                </View>

                {/* Legal */}
                <View style={styles.settingsSection}>
                    <Text style={styles.settingsSectionTitle}>LEGAL</Text>
                    <Card style={styles.settingsSectionCard}>
                        <TouchableOpacity
                            style={styles.settingsItemDetailed}
                            onPress={() => Linking.openURL('https://sites.google.com/view/salahlock/privacy-policy')}
                        >
                            <View style={styles.settingsItemLeftDetailed}>
                                <View style={styles.settingsIconContainer}>
                                    <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.black} />
                                </View>
                                <Text style={styles.settingsItemNameDetailed}>Privacy Policy</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={COLORS.tertiaryText} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingsItemDetailed}
                            onPress={() => Linking.openURL('https://sites.google.com/view/salahlock/terms-of-service')}
                        >
                            <View style={styles.settingsItemLeftDetailed}>
                                <View style={styles.settingsIconContainer}>
                                    <Ionicons name="document-text-outline" size={20} color={COLORS.black} />
                                </View>
                                <Text style={styles.settingsItemNameDetailed}>Terms of Service</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={COLORS.tertiaryText} />
                        </TouchableOpacity>
                    </Card>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    function renderTabBar() {
        const tabs = ['Home', 'Progress', 'Learn', 'Reflect', 'Settings'];
        const icons = {
            Home: 'home',
            Progress: 'trending-up',
            Learn: 'book',
            Reflect: 'heart',
            Settings: 'settings'
        };

        return (
            <View style={styles.tabBar}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={styles.tabItem}
                        onPress={() => {
                            setActiveTab(tab);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                    >
                        <Ionicons
                            name={activeTab === tab ? icons[tab] : `${icons[tab]}-outline`}
                            size={24}
                            color={activeTab === tab ? COLORS.black : COLORS.tertiaryText}
                        />
                        <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    // --- ONBOARDING SCREENS ---

    // Screen 1: Splash/Welcome
    if (!isAppReady && screenIndex === 0) {
        return (
            <View style={styles.container}>
                <Animated.View entering={FadeIn.duration(1000)} style={styles.center}>
                    <Text style={styles.arabicGreeting}>السلام عليكم</Text>
                    <Text style={styles.transliteratedGreeting}>Assalamu Alaikum</Text>
                    <View style={styles.greetingDivider} />
                    <Text style={styles.logo}>salah lock</Text>
                    <Text style={styles.tagline}>A mindful approach to prayer</Text>
                </Animated.View>

                {showBeginButton && (
                    <Animated.View
                        entering={FadeIn.duration(800)}
                        style={[styles.bottomTap, pulseStyle]}
                    >
                        <TouchableOpacity
                            onPress={next}
                            style={styles.beginButton}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.beginButtonText}>begin your journey</Text>
                            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        );
    }

    // Screen 2: Mission Statement
    if (!isAppReady && screenIndex === 1) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={1} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Animated.View entering={FadeIn.delay(200)}>
                            <Text style={styles.quoteTitle}>
                                In a world of endless distractions...
                            </Text>
                            <Text style={styles.quoteBody}>
                                ...create space for what truly matters.
                            </Text>
                        </Animated.View>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 3: The Problem
    if (!isAppReady && screenIndex === 2) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={2} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Animated.View entering={FadeIn} style={styles.illustrationPlaceholder}>
                            <Ionicons name="notifications-outline" size={80} color={COLORS.black} />
                        </Animated.View>
                        <Text style={styles.heading}>
                            On average, we check our phones <Text style={{ color: COLORS.accent }}><CountUp end={96} duration={1000} /></Text> times per day
                        </Text>
                        <Text style={styles.subheading}>
                            Most of those moments? Right before prayer time.
                        </Text>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 4: Name
    if (!isAppReady && screenIndex === 3) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={3} total={29} onBack={back} />
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                        <Text style={styles.introSmall}>first things first</Text>
                        <Text style={styles.heading}>what should we call you?</Text>
                        <TextInput
                            style={styles.nameInput}
                            placeholder="enter your name"
                            placeholderTextColor={COLORS.tertiaryText}
                            autoFocus
                            value={userData.name}
                            onChangeText={(v) => updateData('name', v)}
                        />
                        <View style={styles.spacer} />
                        <PremiumButton
                            title="Continue"
                            onPress={next}
                            disabled={!userData.name.trim()}
                        />
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 5: Age Range
    if (!isAppReady && screenIndex === 4) {
        const options = ['14-24', '25-34', '35-44', '45-54', '55+'];
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={4} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.heading}>and how old are you?</Text>
                        <View style={styles.optionsContainer}>
                            {options.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    onPress={() => {
                                        updateData('ageRange', opt);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                    style={[
                                        styles.optionButton,
                                        userData.ageRange === opt && styles.optionButtonSelected
                                    ]}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        userData.ageRange === opt && styles.optionTextSelected
                                    ]}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} disabled={!userData.ageRange} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 6: Phone Usage
    if (!isAppReady && screenIndex === 5) {
        const options = ['1-2 hours', '2-3 hours', '3-4 hours', '4-5 hours', '5+ hours'];
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={5} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.heading}>how much time do you spend on your phone daily?</Text>
                        <View style={styles.optionsContainer}>
                            {options.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    onPress={() => {
                                        updateData('phoneUsage', opt);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                    style={[
                                        styles.optionButton,
                                        userData.phoneUsage === opt && styles.optionButtonSelected
                                    ]}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        userData.phoneUsage === opt && styles.optionTextSelected
                                    ]}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} disabled={!userData.phoneUsage} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 7: Impact Visualization
    if (!isAppReady && screenIndex === 6) {
        const hours = userData.phoneUsage.includes('+') ? 6 : (parseInt(userData.phoneUsage.split('-')[1]) || 2);
        const yearlyHours = hours * 365;
        const yearlyDays = Math.round(yearlyHours / 24);

        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={6} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Animated.View entering={FadeIn.delay(300)}>
                            <Text style={styles.impactText}>
                                Based on your usage, <Text style={styles.impactHighlight}>{userData.name}</Text>...
                            </Text>
                            <Text style={styles.impactStats}>
                                You'll spend <Text style={styles.impactBold}><CountUp end={yearlyHours} duration={1500} /></Text> hours on your phone this year
                            </Text>
                            <Text style={styles.impactStatsLarge}>
                                That's <Text style={styles.impactBold}><CountUp end={yearlyDays} duration={1500} /></Text> days
                            </Text>
                            <Text style={styles.impactQuestion}>
                                What if even 20 minutes went to prayer?
                            </Text>
                        </Animated.View>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 8: Prayer Frequency
    if (!isAppReady && screenIndex === 7) {
        const options = [0, 1, 2, 3, 4, 5];

        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={7} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.heading}>how many times do you pray per day?</Text>
                        <View style={styles.frequencyGrid}>
                            {options.map(num => (
                                <TouchableOpacity
                                    key={num}
                                    onPress={() => {
                                        updateData('prayerFrequency', num);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                    style={[
                                        styles.frequencyCircle,
                                        userData.prayerFrequency === num && styles.frequencyCircleSelected
                                    ]}
                                >
                                    <Text style={[
                                        styles.frequencyNumber,
                                        userData.prayerFrequency === num && styles.frequencyNumberSelected
                                    ]}>{num}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.supportiveText}>
                            Current: {userData.prayerFrequency} prayers daily
                        </Text>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 8.5: Prayer Goal
    if (!isAppReady && screenIndex === 8) {
        const options = [1, 2, 3, 4, 5];

        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={8} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.heading}>how many times per day do you want to pray?</Text>
                        <Text style={styles.subheading}>Set a realistic goal for yourself</Text>

                        <View style={styles.frequencyGrid}>
                            {options.map(num => (
                                <TouchableOpacity
                                    key={num}
                                    onPress={() => {
                                        updateData('prayerGoal', num);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                    style={[
                                        styles.frequencyCircle,
                                        userData.prayerGoal === num && styles.frequencyCircleSelected
                                    ]}
                                >
                                    <Text style={[
                                        styles.frequencyNumber,
                                        userData.prayerGoal === num && styles.frequencyNumberSelected
                                    ]}>{num}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 9: Relationship Status
    if (!isAppReady && screenIndex === 9) {
        const options = [
            { label: '📈 Growing and consistent', id: 'growing' },
            { label: '📊 It has its ups and downs', id: 'fluctuating' },
            { label: '🌱 Just starting or rebuilding', id: 'starting' },
            { label: '🤝 Close and consistent', id: 'close' },
        ];
        return (
            <ScreenTransition direction={screenIndex > 8 ? 'forward' : 'back'}>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={9} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.heading}>how would you describe your relationship with Allah right now?</Text>
                        <View style={styles.optionsContainer}>
                            {options.map(opt => (
                                <TouchableOpacity
                                    key={opt.id}
                                    onPress={() => updateData('relationshipStatus', opt.id)}
                                    style={[
                                        styles.optionButton,
                                        userData.relationshipStatus === opt.id && styles.optionButtonSelected
                                    ]}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        userData.relationshipStatus === opt.id && styles.optionTextSelected
                                    ]}>{opt.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} disabled={!userData.relationshipStatus} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 10: Main Goals
    if (!isAppReady && screenIndex === 10) {
        // ... (rest of the block)
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={10} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.heading}>what do you want to achieve?</Text>
                        <Text style={styles.subheading}>choose up to 3</Text>
                        <ScrollView contentContainerStyle={styles.goalsGrid}>
                            {GOALS_OPTIONS.map(goal => (
                                <TouchableOpacity
                                    key={goal.label}
                                    onPress={() => toggleGoal(goal.label)}
                                    style={[
                                        styles.goalCard,
                                        userData.goals.includes(goal.label) && styles.goalCardSelected
                                    ]}
                                >
                                    <Text style={styles.goalLabel}>{goal.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} disabled={userData.goals.length === 0} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 11: Primary Challenge
    if (!isAppReady && screenIndex === 11) {
        // ...
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={11} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.heading}>what's the biggest obstacle to consistent prayer?</Text>
                        <ScrollView>
                            {CHALLENGE_OPTIONS.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    onPress={() => updateData('challenges', [opt])}
                                    style={[
                                        styles.optionButton,
                                        userData.challenges.includes(opt) && styles.optionButtonSelected
                                    ]}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        userData.challenges.includes(opt) && styles.optionTextSelected
                                    ]}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} disabled={userData.challenges.length === 0} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 12: Deeper Struggles (Optional)
    if (!isAppReady && screenIndex === 12) {
        // ...
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={12} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.heading}>sometimes, deeper struggles affect our prayer life</Text>
                        <Text style={styles.subheading}>do any of these resonate? (optional)</Text>
                        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
                            {STRUGGLE_OPTIONS.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    onPress={() => toggleStruggle(opt)}
                                    style={[
                                        styles.optionButton,
                                        userData.deeperStruggles.includes(opt) && styles.optionButtonSelected
                                    ]}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        userData.deeperStruggles.includes(opt) && styles.optionTextSelected
                                    ]}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                onPress={() => {
                                    updateData('deeperStruggles', ['None']);
                                    next();
                                }}
                                style={styles.optionButton}
                            >
                                <Text style={styles.optionText}>🙅 None of these</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        <Text style={styles.privacyNote}>Your responses are private</Text>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 13: The Salah Lock Approach
    if (!isAppReady && screenIndex === 13) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={13} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.introSmall}>a different approach</Text>
                        <Text style={styles.approachTitle}>Salah Lock doesn't just remind you to pray.</Text>
                        <Text style={styles.approachTitle}>It creates sacred space by gently removing distractions.</Text>
                        <View style={styles.spacer} />
                        <PremiumButton title="Tell me more" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 14: Madhab Selection
    if (!isAppReady && screenIndex === 14) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={14} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.introSmall}>to personalize your experience</Text>
                        <Text style={styles.heading}>what is your madhab?</Text>
                        <Text style={styles.subheading}>this helps us show the right prayer times (optional)</Text>

                        <View style={{ marginTop: 30 }}>
                            {['Hanafi', 'Shafi\'i', 'Maliki', 'Hanbali', 'I don\'t follow a specific madhab'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.optionButton,
                                        userData.madhab === option && styles.optionButtonSelected
                                    ]}
                                    onPress={() => updateData('madhab', option)}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        userData.madhab === option && styles.optionTextSelected
                                    ]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 15: Gender Selection
    if (!isAppReady && screenIndex === 15) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={15} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.introSmall}>to personalize your reminders</Text>
                        <Text style={styles.heading}>how should we address you?</Text>

                        <View style={{ marginTop: 40 }}>
                            {['Brother', 'Sister'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.optionButton,
                                        userData.gender === option && styles.optionButtonSelected
                                    ]}
                                    onPress={() => updateData('gender', option)}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        userData.gender === option && styles.optionTextSelected
                                    ]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 16: Journey Summary
    if (!isAppReady && screenIndex === 16) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={16} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.introSmall}>thanks for sharing</Text>
                        <Text style={styles.heading}>here's what we heard</Text>

                        <View style={{ marginTop: 30, gap: 16 }}>
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryLabel}>where you want to be</Text>
                                <Text style={styles.summaryContent}>🕌 Praying all 5 salah with consistency</Text>
                            </View>

                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryLabel}>where you are now</Text>
                                <Text style={styles.summaryContent}>🌱 Just starting or rebuilding</Text>
                            </View>

                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryLabel}>what's getting in the way</Text>
                                <Text style={styles.summaryContent}>📱 Phone and social media</Text>
                            </View>
                        </View>

                        <Text style={[styles.subheading, { marginTop: 24 }]}>
                            We see you. Together, we'll build a plan that helps you grow closer to Allah, one prayer at a time.
                        </Text>

                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 17: Loading/Building Screen
    if (!isAppReady && screenIndex === 17) {
        return <LoadingBuildScreen onComplete={next} styles={styles} />;
    }

    // Screen 18: Commitment Question
    if (!isAppReady && screenIndex === 18) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={18} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.introSmall}>one last thing</Text>
                        <Text style={styles.heading}>how committed are you to building your prayer habit?</Text>

                        <View style={{ marginTop: 30 }}>
                            {[
                                { emoji: '🔥', label: 'Extremely committed' },
                                { emoji: '💪', label: 'Very committed' },
                                { emoji: '🤔', label: 'Somewhat committed' },
                                { emoji: '🌱', label: 'A little committed' },
                                { emoji: '✨', label: 'Just exploring' },
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option.label}
                                    style={[
                                        styles.optionButton,
                                        userData.commitmentLevel === option.label && styles.optionButtonSelected
                                    ]}
                                    onPress={() => updateData('commitmentLevel', option.label)}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        userData.commitmentLevel === option.label && styles.optionTextSelected
                                    ]}>{option.emoji} {option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 19: The "Why" Screen with 7-Day Preview & Free Trial
    if (!isAppReady && screenIndex === 19) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={19} total={29} onBack={back} />
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <Text style={[styles.heading, { textAlign: 'center' }]}>it's not about willpower</Text>
                        <Text style={[styles.subheading, { textAlign: 'center' }]}>it's about making space for Allah</Text>

                        <Text style={[styles.subheading, { marginTop: 24 }]}>
                            The Prophet ﷺ said salah is the first thing we'll be asked about. Each prayer takes just minutes, yet we spend hours on our phones. Salah Lock helps you reclaim that time.
                        </Text>

                        <Text style={[styles.sectionHeader, { marginTop: 30 }]}>your first 7 days:</Text>

                        <View style={styles.dayCard}>
                            <Text style={styles.dayTitle}>Day 1 - Enter the sacred space</Text>
                            <Text style={styles.dayDesc}>Complete your first prayer lock. Feel the peace of putting Allah first.</Text>
                        </View>

                        <View style={styles.dayCard}>
                            <Text style={styles.dayTitle}>Day 2 - Build the habit</Text>
                            <Text style={styles.dayDesc}>The lock might feel hard. That's normal. We'll help you push through.</Text>
                        </View>

                        <View style={styles.dayCard}>
                            <Text style={styles.dayTitle}>Day 3 - Find your rhythm</Text>
                            <Text style={styles.dayDesc}>Guided prompts will help you surrender your worries to Allah.</Text>
                        </View>

                        <Text style={[styles.subheading, { marginTop: 20, textAlign: 'center' }]}>
                            5 daily prayers = reward of 50. Allah multiplies your good deeds 10x.
                        </Text>

                        <View style={styles.dividerLine} />

                        <Text style={[styles.heading, { fontSize: 24, marginTop: 20 }]}>Start your 3-day free trial</Text>

                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.timelineItem}>📅 Today - Unlock all features: app blocking, personalized plan, streak tracking</Text>
                            <Text style={styles.timelineItem}>⏰ In 2 days - We'll remind you the trial is ending</Text>
                            <Text style={styles.timelineItem}>✅ In 3 days - You'll be charged unless you cancel anytime</Text>
                        </View>

                        <View style={styles.planContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.planCard,
                                    userData.selectedPlan === 'monthly' && styles.planCardSelected
                                ]}
                                onPress={() => updateData('selectedPlan', 'monthly')}
                            >
                                <Text style={styles.planLabel}>monthly</Text>
                                <Text style={styles.planPrice}>$10/month</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.planCard,
                                    userData.selectedPlan === 'yearly' && styles.planCardSelected
                                ]}
                                onPress={() => updateData('selectedPlan', 'yearly')}
                            >
                                <View style={styles.trialBadge}>
                                    <Text style={styles.trialBadgeText}>3-day free trial</Text>
                                </View>
                                <Text style={styles.planLabel}>yearly</Text>
                                <Text style={styles.planPrice}>$70/year</Text>
                                <Text style={styles.planSubtext}>($5.83/month)</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.privacyNoticeText}>Cancel anytime. No payment due now.</Text>

                        <PremiumButton
                            title="Start my free trial"
                            onPress={next}
                            style={{ marginTop: 20 }}
                        />

                        <Text style={styles.finePrint}>3 days free, then $70/year. Cancel anytime.</Text>

                        <View style={styles.footerLinks}>
                            <TouchableOpacity><Text style={styles.footerLink}>Privacy</Text></TouchableOpacity>
                            <Text style={styles.footerDivider}>|</Text>
                            <TouchableOpacity><Text style={styles.footerLink}>Terms</Text></TouchableOpacity>
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 20: How It Works
    if (!isAppReady && screenIndex === 20) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={20} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.heading}>how it works</Text>
                        <View style={styles.stepCard}>
                            <Text style={styles.stepNum}>1</Text>
                            <View>
                                <Text style={styles.stepTitle}>Set your prayer times</Text>
                                <Text style={styles.stepDesc}>Automatic by location</Text>
                            </View>
                        </View>
                        <View style={styles.stepCard}>
                            <Text style={styles.stepNum}>2</Text>
                            <View>
                                <Text style={styles.stepTitle}>Choose apps to pause</Text>
                                <Text style={styles.stepDesc}>Selected apps focus lock</Text>
                            </View>
                        </View>
                        <View style={styles.stepCard}>
                            <Text style={styles.stepNum}>3</Text>
                            <View>
                                <Text style={styles.stepTitle}>Pray with full presence</Text>
                                <Text style={styles.stepDesc}>Connect without noise</Text>
                            </View>
                        </View>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 21: Lock Experience
    if (!isAppReady && screenIndex === 21) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={21} total={29} onBack={back} />
                    <View style={styles.content}>
                        <View style={styles.mockupContainer}>
                            <View style={styles.mockPhone}>
                                <View style={styles.mockStatus} />
                                <Ionicons name="lock-closed" size={40} color={COLORS.black} />
                                <Text style={styles.mockText}>Instagram is paused</Text>
                                <Text style={styles.mockSubtext}>This time is for Allah</Text>
                                <View style={styles.mockButton} />
                            </View>
                        </View>
                        <Text style={styles.heading}>At prayer time, selected apps pause for 20 minutes</Text>
                        <Text style={styles.subheading}>A gentle reminder: this time is for Allah</Text>
                        <View style={styles.spacer} />
                        <PremiumButton title="Continue" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 22: Permission Intro
    if (!isAppReady && screenIndex === 22) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={22} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.heading}>to get started, we need two things</Text>
                        <View style={styles.permissionCard}>
                            <Ionicons name="location-sharp" size={24} color={COLORS.black} />
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <Text style={styles.stepTitle}>Your location</Text>
                                <Text style={styles.stepDesc}>for accurate prayer times</Text>
                            </View>
                        </View>
                        <View style={styles.permissionCard}>
                            <Ionicons name="timer-outline" size={24} color={COLORS.black} />
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <Text style={styles.stepTitle}>Screen Time access</Text>
                                <Text style={styles.stepDesc}>to pause apps during prayer</Text>
                            </View>
                        </View>
                        <Text style={styles.privacyNoteFull}>
                            We take your privacy seriously. Your data stays on your device.
                        </Text>
                        <View style={styles.spacer} />
                        <PremiumButton title="Let's begin" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 23: Location Request
    if (!isAppReady && screenIndex === 23) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={23} total={29} onBack={back} />
                    <View style={styles.content}>
                        <View style={styles.centerIllustration}>
                            <Ionicons name="location" size={100} color={COLORS.black} />
                        </View>
                        <Text style={styles.heading}>Enable Location</Text>
                        <Text style={styles.subheading}>
                            We'll use your location to calculate the precise prayer times for your area
                        </Text>
                        <View style={styles.spacer} />
                        {prayerError && (
                            <Text style={[styles.errorText, { marginBottom: 12, textAlign: 'center' }]}>
                                {prayerError}
                            </Text>
                        )}
                        <PremiumButton title="Enable Location" onPress={next} />
                        <Text style={styles.privacyNoteSmall}>You can change this in Settings anytime</Text>
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 24: Loading
    if (!isAppReady && screenIndex === 24) {
        return (
            <ScreenTransition>
                <View style={styles.container}>
                    <Header current={24} total={29} hideProgress />
                    <ActivityIndicator size="large" color={COLORS.black} />
                    <Text style={styles.loadingText}>Calculating your prayer times...</Text>
                </View>
            </ScreenTransition>
        );
    }

    // Screen 25: Prayer Times
    if (!isAppReady && screenIndex === 25) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={25} total={29} onBack={back} />
                    <View style={styles.content}>
                        <Text style={styles.introSmall}>🕌 North Haven, CT</Text>
                        <Text style={styles.heading}>Your Prayer Times</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {Object.entries(prayerTimes).map(([name, data]) => (
                                <View key={name} style={[
                                    styles.prayerTimeCard,
                                    name === 'Dhuhr' && { borderLeftWidth: 3, borderLeftColor: COLORS.black }
                                ]}>
                                    <View style={styles.prayerRow}>
                                        <Text style={styles.prayerName}>{name}</Text>
                                        <Text style={styles.prayerArabic}>{data.arabic}</Text>
                                    </View>
                                    <Text style={styles.prayerTime}>{data.time}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={styles.spacer} />
                        <PremiumButton title="Perfect" onPress={next} />
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 26: Screen Time Permission
    if (!isAppReady && screenIndex === 26) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={26} total={29} onBack={back} />
                    <View style={styles.content}>
                        <View style={styles.centerIllustration}>
                            <Ionicons name="shield-checkmark" size={100} color={COLORS.black} />
                        </View>
                        <Text style={styles.heading}>Enable Screen Time</Text>
                        <Text style={styles.subheading}>
                            This is required for Salah Lock to pause distracting apps during your prayer times.
                        </Text>
                        <View style={styles.spacer} />
                        <PremiumButton
                            title={hasScreenTimePermission ? "Permission Granted" : "Allow Screen Time"}
                            onPress={async () => {
                                if (hasScreenTimePermission) {
                                    next();
                                } else {
                                    const success = await handleRequestScreenTime();
                                    if (success) next();
                                }
                            }}
                            disabled={hasScreenTimePermission}
                        />
                        <TouchableOpacity onPress={next} style={{ marginTop: 20 }}>
                            <Text style={styles.skipText}>I'll do this later</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 27: App Selection
    if (!isAppReady && screenIndex === 27) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={27} total={29} onBack={back} />
                    <View style={styles.content}>
                        <View style={styles.centerIllustration}>
                            <Ionicons name="apps" size={100} color={COLORS.black} />
                        </View>
                        <Text style={styles.heading}>Choose Apps to Block</Text>
                        <Text style={styles.subheading}>
                            Select the social media and games you want to lock during those 20 minutes of prayer.
                        </Text>

                        <View style={styles.selectionStatusCard}>
                            {isAppsSelected ? (
                                <View style={styles.successRow}>
                                    <Ionicons name="checkmark-circle" size={24} color={COLORS.accent} />
                                    <Text style={styles.successText}>Apps Selected Successfully</Text>
                                </View>
                            ) : (
                                <Text style={styles.statusText}>No apps selected yet</Text>
                            )}
                        </View>

                        <View style={styles.spacer} />

                        <PremiumButton
                            title={isAppsSelected ? "Change Selection" : "Select Apps"}
                            onPress={handleSelectApps}
                        />

                        <PremiumButton
                            title="Done"
                            style={{ marginTop: 12 }}
                            onPress={next}
                            disabled={!isAppsSelected}
                        />

                        {!isAppsSelected && (
                            <TouchableOpacity onPress={next} style={{ marginTop: 20 }}>
                                <Text style={styles.skipText}>Skip for now</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 28: How Prayer Lock Works (Instruction Screen)
    if (!isAppReady && screenIndex === 28) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <Header current={28} total={29} onBack={back} />
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <Text style={styles.heading}>How Prayer Lock Works</Text>
                        <Text style={styles.subheading}>
                            Here's how SalahTaqa helps you stay focused during prayer times.
                        </Text>

                        <View style={styles.instructionCardsContainer}>
                            <Card style={styles.instructionCard}>
                                <View style={styles.instructionIconContainer}>
                                    <Ionicons name="lock-closed" size={28} color={COLORS.accent} />
                                </View>
                                <View style={styles.instructionTextContainer}>
                                    <Text style={styles.instructionTitle}>Apps Lock Automatically</Text>
                                    <Text style={styles.instructionDescription}>
                                        During prayer time, your selected apps will be locked and restricted.
                                    </Text>
                                </View>
                            </Card>

                            <Card style={styles.instructionCard}>
                                <View style={styles.instructionIconContainer}>
                                    <Ionicons name="checkmark-circle" size={28} color={COLORS.accent} />
                                </View>
                                <View style={styles.instructionTextContainer}>
                                    <Text style={styles.instructionTitle}>Unlock After Prayer</Text>
                                    <Text style={styles.instructionDescription}>
                                        To unlock your apps, return to SalahTaqa and tap "I Have Prayed".
                                    </Text>
                                </View>
                            </Card>

                            <Card style={styles.instructionCard}>
                                <View style={styles.instructionIconContainer}>
                                    <Ionicons name="list" size={28} color={COLORS.accent} />
                                </View>
                                <View style={styles.instructionTextContainer}>
                                    <Text style={styles.instructionTitle}>Track Your Progress</Text>
                                    <Text style={styles.instructionDescription}>
                                        Check off each of the 5 daily prayers, and your progress will be tracked automatically.
                                    </Text>
                                </View>
                            </Card>

                            <Card style={styles.instructionCard}>
                                <View style={styles.instructionIconContainer}>
                                    <Ionicons name="trophy" size={28} color="#FF9500" />
                                </View>
                                <View style={styles.instructionTextContainer}>
                                    <Text style={styles.instructionTitle}>Earn Milestones</Text>
                                    <Text style={styles.instructionDescription}>
                                        Build streaks and unlock achievements as you maintain your prayer consistency.
                                    </Text>
                                </View>
                            </Card>
                        </View>

                        <View style={{ height: 20 }} />
                        <PremiumButton
                            title="Continue to Dashboard"
                            onPress={next}
                        />
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // Screen 29: Final Success
    if (!isAppReady && screenIndex === 29) {
        return (
            <ScreenTransition>
                <SafeAreaView style={styles.safeContainer}>
                    <View style={styles.content}>
                        <Animated.View entering={FadeIn} style={{ flex: 1 }}>
                            <Text style={styles.successBadge}>MashaAllah</Text>
                            <Text style={styles.heading}>You're all set, {userData.name}</Text>
                            <Card style={{ padding: 24, marginTop: 40 }}>
                                <View style={styles.successRow}>
                                    <Ionicons name="checkmark-circle" size={24} color={COLORS.accent} />
                                    <Text style={styles.successText}>Prayer times configured</Text>
                                </View>
                                <View style={styles.successRow}>
                                    <Ionicons name="checkmark-circle" size={24} color={COLORS.accent} />
                                    <Text style={styles.successText}>Screen Time enabled</Text>
                                </View>
                                <View style={styles.dividerLarge} />
                                <Text style={styles.nextPrayerLabel}>Next prayer:</Text>
                                <Text style={styles.nextPrayerValue}>Dhuhr at 12:06 PM</Text>
                            </Card>
                            <View style={styles.spacer} />
                            <PremiumButton
                                title="Begin Your Journey"
                                onPress={() => {
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                    setIsAppReady(true);
                                }}
                            />
                        </Animated.View>
                    </View>
                </SafeAreaView>
            </ScreenTransition>
        );
    }

    // --- DASHBOARD ---
    if (isAppReady || screenIndex > 29) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                {isChangingLocation ? (
                    renderLocationSearch()
                ) : (
                    <View style={styles.dashboard}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                            {activeTab === 'Home' && renderHome()}
                            {activeTab === 'Progress' && renderProgress()}
                            {activeTab === 'Learn' && renderLearn()}
                            {activeTab === 'Reflect' && renderReflect()}
                            {activeTab === 'Settings' && renderSettings()}
                        </ScrollView>
                        {renderTabBar()}
                    </View>
                )}
            </SafeAreaView>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    center: {
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 40,
    },
    fullScreenSearch: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    searchHeaderTitle: {
        fontSize: 18,
        fontFamily: FONTS.demi,
        color: COLORS.black,
    },
    cancelButton: {
        width: 60,
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.accent,
    },
    searchInputWrapperLarge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        marginHorizontal: 20,
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 54,
        marginTop: 20,
        marginBottom: 20,
    },
    searchIconLarge: {
        marginRight: 12,
    },
    citySearchInputLarge: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.black,
    },
    emptySearchContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 100,
    },
    emptySearchText: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        textAlign: 'center',
        marginTop: 20,
    },
    suggestionsListFull: {
        flex: 1,
    },
    suggestionItemLarge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    suggestionTextLarge: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.black,
        marginLeft: 15,
    },
    changeLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 15,
    },
    changeLocationButtonText: {
        fontSize: 15,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginLeft: 10,
    },
    logo: {
        fontSize: 48,
        fontFamily: FONTS.light,
        color: COLORS.black,
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 10,
    },
    bottomTap: {
        position: 'absolute',
        bottom: 80,
    },
    tapToBegin: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        letterSpacing: 1,
    },
    heading: {
        fontSize: 32,
        fontFamily: FONTS.demi,
        color: COLORS.black,
        lineHeight: 40,
        marginTop: 10,
    },
    subheading: {
        fontSize: 18,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 15,
        lineHeight: 28,
    },
    introSmall: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.tertiaryText,
        textTransform: 'lowercase',
    },
    quoteTitle: {
        fontSize: 28,
        fontFamily: FONTS.light,
        color: COLORS.black,
        lineHeight: 38,
    },
    quoteBody: {
        fontSize: 24,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginTop: 20,
        lineHeight: 34,
    },
    nameInput: {
        fontSize: 24,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
        paddingVertical: 15,
        marginTop: 40,
    },
    button: {
        backgroundColor: COLORS.black,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontFamily: FONTS.medium,
    },
    spacer: {
        flex: 1,
    },
    optionsContainer: {
        marginTop: 40,
    },
    optionButton: {
        backgroundColor: COLORS.offWhite,
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionButtonSelected: {
        borderColor: COLORS.black,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    optionText: {
        fontSize: 18,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
    },
    optionTextSelected: {
        color: COLORS.black,
    },
    impactText: {
        fontSize: 24,
        fontFamily: FONTS.primary,
        color: COLORS.black,
    },
    impactHighlight: {
        fontFamily: FONTS.bold,
    },
    impactStats: {
        fontSize: 22,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        marginTop: 30,
    },
    impactStatsLarge: {
        fontSize: 42,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginTop: 10,
    },
    impactBold: {
        color: '#FF9500',
    },
    impactQuestion: {
        fontSize: 20,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginTop: 40,
    },
    sliderContainer: {
        marginTop: 60,
        alignItems: 'center',
    },
    sliderValue: {
        fontSize: 28,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginBottom: 20,
    },
    sliderMock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    sliderDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.divider,
    },
    sliderDotSelected: {
        backgroundColor: COLORS.black,
        transform: [{ scale: 1.2 }],
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
    },
    sliderLabel: {
        fontSize: 14,
        color: COLORS.tertiaryText,
    },
    supportiveText: {
        fontSize: 16,
        color: COLORS.secondaryText,
        fontFamily: FONTS.primary,
        textAlign: 'center',
        marginTop: 40,
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        marginBottom: 20,
    },
    dayCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.offWhite,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    dayCircleSelected: {
        backgroundColor: COLORS.black,
        borderColor: COLORS.black,
    },
    dayText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.black,
    },
    dayTextSelected: {
        color: COLORS.white,
    },
    dashboard: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    dashboardContent: {
        padding: 24,
    },
    dashHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    dashGreeting: {
        fontSize: 24,
        fontFamily: FONTS.demi,
        color: COLORS.black,
    },
    dashDate: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 4,
    },
    dashTitleLarge: {
        fontSize: 32,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginBottom: 24,
    },
    nextPrayerCard: {
        backgroundColor: COLORS.black,
        padding: 24,
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    nextPrayerInfo: {
        flex: 1,
    },
    nextLabel: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1,
    },
    nextName: {
        fontSize: 28,
        fontFamily: FONTS.demi,
        color: COLORS.white,
        marginTop: 4,
    },
    nextTime: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    countdownContainer: {
        alignItems: 'flex-end',
    },
    countdownValue: {
        fontSize: 24,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
    countdownLabel: {
        fontSize: 10,
        fontFamily: FONTS.primary,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: FONTS.demi,
        color: COLORS.black,
    },
    sectionAction: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
    },
    prayerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.offWhite,
        borderRadius: 16,
        marginBottom: 12,
    },
    prayerItemCompleted: {
        opacity: 0.6,
    },
    prayerItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    prayerItemName: {
        fontSize: 18,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginLeft: 16,
    },
    prayerItemTime: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
    },
    textStrikethrough: {
        textDecorationLine: 'line-through',
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    gridCard: {
        flex: 1,
        marginHorizontal: 0,
        padding: 20,
        marginRight: 10,
        backgroundColor: COLORS.white,
    },
    gridCardTitle: {
        fontSize: 12,
        fontFamily: FONTS.medium,
        color: COLORS.tertiaryText,
        marginTop: 12,
    },
    gridCardValue: {
        fontSize: 16,
        fontFamily: FONTS.demi,
        color: COLORS.black,
        marginTop: 2,
    },
    tabBar: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        height: 70,
        backgroundColor: COLORS.white,
        borderRadius: 35,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 10,
        fontFamily: FONTS.medium,
        color: COLORS.tertiaryText,
        marginTop: 4,
    },
    tabLabelActive: {
        color: COLORS.black,
    },
    statCard: {
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    statValue: {
        fontSize: 48,
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },
    statLabel: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        marginTop: 8,
    },
    statValueSmall: {
        fontSize: 32,
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },
    statLabelSmall: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        marginTop: 4,
    },
    streakRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dashTitleMain: {
        fontSize: 34,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        letterSpacing: -0.5,
    },
    dashSubtitle: {
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 4,
    },
    dashDateText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.tertiaryText,
        marginTop: 8,
        textTransform: 'uppercase',
    },
    nextPrayerCardMain: {
        backgroundColor: COLORS.black,
        padding: 24,
        borderRadius: 28,
        marginTop: 20,
        marginBottom: 30,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    nextCardStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.accent,
        marginRight: 8,
    },
    nextCardLabel: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1,
    },
    nextCardName: {
        fontSize: 32,
        fontFamily: FONTS.demi,
        color: COLORS.white,
    },
    nextCardCountdown: {
        fontSize: 20,
        fontFamily: FONTS.medium,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    cardProgressBarContainer: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        marginTop: 20,
        overflow: 'hidden',
    },
    cardProgressBar: {
        height: '100%',
        backgroundColor: COLORS.accent,
        borderRadius: 3,
    },
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    dateSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    currentDateKey: {
        fontSize: 16,
        fontFamily: FONTS.demi,
        color: COLORS.black,
        marginHorizontal: 20,
    },
    prayerCardDetailed: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.offWhite,
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },
    prayerCardInfo: {
        flex: 1,
    },
    prayerNameDetailed: {
        fontSize: 18,
        fontFamily: FONTS.demi,
        color: COLORS.black,
    },
    prayerArabicDetailed: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        marginTop: 2,
    },
    prayerTimeDetailed: {
        fontSize: 18,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginRight: 16,
    },
    featureCard: {
        marginTop: 10,
        padding: 0,
        borderRadius: 20,
        overflow: 'hidden',
    },
    featureCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    featureIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.offWhite,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureTitle: {
        fontSize: 16,
        fontFamily: FONTS.demi,
        color: COLORS.black,
    },
    featureSubtitle: {
        fontSize: 13,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 2,
    },
    calendarContainer: {
        marginTop: 30,
        backgroundColor: COLORS.offWhite,
        padding: 20,
        borderRadius: 24,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    calendarMonth: {
        fontSize: 18,
        fontFamily: FONTS.demi,
        color: COLORS.black,
    },
    calendarNav: {
        flexDirection: 'row',
    },
    weekGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    weekDayLabel: {
        width: `${100 / 7}%`,
        textAlign: 'center',
        fontSize: 12,
        fontFamily: FONTS.bold,
        color: COLORS.tertiaryText,
        marginBottom: 15,
    },
    calendarDay: {
        width: `${100 / 7}%`,
        alignItems: 'center',
        marginBottom: 10,
    },
    dayCircleMini: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayCircleActive: {
        backgroundColor: COLORS.black,
    },
    dayTextMini: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.black,
    },
    completionDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.accent,
        marginTop: 4,
    },
    qiblaCard: {
        marginTop: 20,
        padding: 24,
        borderRadius: 24,
    },
    qiblaTitle: {
        fontSize: 18,
        fontFamily: FONTS.demi,
        color: COLORS.black,
        marginBottom: 20,
    },
    qiblaContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    compassContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    compassCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: COLORS.divider,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qiblaInfo: {
        marginLeft: 24,
    },
    qiblaDirectionText: {
        fontSize: 24,
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },
    qiblaLink: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.accent,
        marginTop: 4,
    },
    observancesSection: {
        marginTop: 30,
        marginBottom: 20,
    },
    emptyObservances: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        marginTop: 8,
    },
    // Progress Tab Styles
    progressMainCard: {
        padding: 30,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        borderRadius: 32,
    },
    progressStatCount: {
        fontSize: 64,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        letterSpacing: -2,
    },
    progressStatLabel: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        color: COLORS.tertiaryText,
        letterSpacing: 1,
        marginTop: 4,
    },
    progressMiniStats: {
        flexDirection: 'row',
        marginTop: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
        paddingTop: 20,
    },
    miniStatItem: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    miniStatValue: {
        fontSize: 24,
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },
    miniStatLabel: {
        fontSize: 12,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 2,
    },
    miniStatDivider: {
        width: 1,
        height: 30,
        backgroundColor: COLORS.divider,
    },
    milestoneCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
    },
    milestoneIconContainer: {
        width: 54,
        height: 54,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    milestoneTitle: {
        fontSize: 17,
        fontFamily: FONTS.demi,
        color: COLORS.black,
    },
    milestoneDesc: {
        fontSize: 13,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 2,
    },
    // Learn Tab Styles
    learnChatCard: {
        backgroundColor: COLORS.black,
        padding: 24,
        borderRadius: 28,
        marginTop: 20,
        marginBottom: 30,
    },
    chatCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    chatIconBackground: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatCardTitle: {
        fontSize: 20,
        fontFamily: FONTS.demi,
        color: COLORS.white,
        marginLeft: 16,
    },
    chatCardBody: {
        fontSize: 15,
        fontFamily: FONTS.primary,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 22,
    },
    chatCardButton: {
        backgroundColor: COLORS.accent,
        height: 50,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    chatCardButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: FONTS.medium,
        marginRight: 8,
    },
    sectionHeaderLearn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAllText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.accent,
    },
    horizontalScrollContent: {
        paddingBottom: 20,
    },
    pillarCard: {
        width: 120,
        height: 150,
        borderRadius: 24,
        padding: 20,
        justifyContent: 'flex-end',
        marginRight: 16,
    },
    pillarTitle: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: FONTS.bold,
        marginTop: 12,
    },
    holidayCard: {
        width: 180,
        height: 120,
        padding: 20,
        borderRadius: 24,
        marginRight: 16,
        justifyContent: 'center',
    },
    holidayDays: {
        fontSize: 11,
        fontFamily: FONTS.bold,
        color: COLORS.accent,
        textTransform: 'uppercase',
    },
    holidayTitle: {
        fontSize: 17,
        fontFamily: FONTS.demi,
        color: COLORS.black,
        marginTop: 4,
    },
    holidayDate: {
        fontSize: 13,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 2,
    },
    // Reflect Tab Styles
    moodGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 30,
    },
    moodItem: {
        width: 58,
        height: 58,
        borderRadius: 20,
        backgroundColor: COLORS.offWhite,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    moodItemSelected: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.black,
        transform: [{ scale: 1.1 }],
    },
    moodEmoji: {
        fontSize: 28,
    },
    journalCard: {
        padding: 24,
        borderRadius: 32,
        marginBottom: 30,
    },
    journalPromptLabel: {
        fontSize: 11,
        fontFamily: FONTS.bold,
        color: COLORS.tertiaryText,
        letterSpacing: 1,
    },
    journalPrompt: {
        fontSize: 20,
        fontFamily: FONTS.demi,
        color: COLORS.black,
        marginTop: 8,
        lineHeight: 28,
    },
    journalInput: {
        backgroundColor: COLORS.offWhite,
        borderRadius: 20,
        padding: 20,
        height: 150,
        marginTop: 20,
        fontSize: 16,
        fontFamily: FONTS.primary,
        color: COLORS.black,
        textAlignVertical: 'top',
    },
    saveJournalButton: {
        backgroundColor: COLORS.black,
        height: 44,
        paddingHorizontal: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop removed to align with Clear button in the row
    },
    saveJournalText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: FONTS.medium,
    },
    emptyStateContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        marginTop: 12,
    },
    // Settings Tab Styles
    settingsSection: {
        marginTop: 25,
    },
    settingsSectionTitle: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        color: COLORS.tertiaryText,
        letterSpacing: 1.5,
        marginLeft: 4,
        marginBottom: 10,
    },
    settingsSectionCard: {
        padding: 0,
        borderRadius: 24,
        overflow: 'hidden',
    },
    settingsItemDetailed: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    settingsItemLeftDetailed: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingsLocationSubtitle: {
        fontSize: 13,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        marginTop: 2,
    },
    modeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    modeBadgeText: {
        fontSize: 11,
        fontFamily: FONTS.bold,
    },
    settingsIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.offWhite,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    locationControls: {
        paddingHorizontal: 18,
        paddingBottom: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    gpsButton: {
        backgroundColor: COLORS.black,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 10,
    },
    gpsButtonText: {
        color: COLORS.white,
        fontFamily: FONTS.demi,
        fontSize: 15,
        marginLeft: 8,
    },
    searchTitle: {
        fontSize: 13,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginTop: 20,
        marginBottom: 12,
    },
    dividerSmall: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginVertical: 15,
        opacity: 0.5,
    },
    searchContainer: {
        zIndex: 10,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.offWhite,
        borderRadius: 16,
        paddingHorizontal: 15,
        height: 52,
    },
    searchIcon: {
        marginRight: 10,
    },
    citySearchInput: {
        flex: 1,
        fontFamily: FONTS.primary,
        fontSize: 15,
        color: COLORS.black,
    },
    suggestionsContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginTop: 8,
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.divider,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.offWhite,
    },
    suggestionText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginLeft: 10,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        fontFamily: FONTS.primary,
        marginTop: 10,
        textAlign: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginTop: 20,
    },
    settingsItemNameDetailed: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginLeft: 14,
    },
    settingsItemRightDetailed: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsItemValueDetailed: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginRight: 8,
    },
    logoutButton: {
        marginTop: 40,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#FFF1F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: COLORS.tertiaryText,
        marginTop: 20,
        fontFamily: FONTS.primary,
    },
    settingsItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    settingsItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsItemName: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginLeft: 16,
    },
    successBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        color: COLORS.accent,
        fontSize: 14,
        fontFamily: FONTS.demi,
        marginBottom: 16,
        overflow: 'hidden',
    },
    goalsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    goalCard: {
        width: '48%',
        backgroundColor: COLORS.offWhite,
        padding: 20,
        borderRadius: 16,
        marginBottom: 15,
        minHeight: 120,
        justifyContent: 'center',
    },
    goalCardSelected: {
        borderWidth: 1,
        borderColor: COLORS.black,
        backgroundColor: COLORS.white,
    },
    goalLabel: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.black,
    },
    privacyNote: {
        fontSize: 12,
        color: COLORS.tertiaryText,
        textAlign: 'center',
        marginTop: 20,
    },
    approachTitle: {
        fontSize: 32,
        fontFamily: FONTS.demi,
        color: COLORS.black,
        marginTop: 20,
        lineHeight: 40,
    },
    approachBody: {
        fontSize: 20,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 20,
        lineHeight: 30,
    },
    stepCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.offWhite,
        padding: 24,
        borderRadius: 20,
        marginBottom: 16,
    },
    stepNum: {
        fontSize: 32,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginRight: 20,
        opacity: 0.1,
    },
    stepTitle: {
        fontSize: 18,
        fontFamily: FONTS.demi,
        color: COLORS.black,
    },
    stepDesc: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 4,
    },
    mockupContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    mockPhone: {
        width: 200,
        height: 300,
        backgroundColor: COLORS.offWhite,
        borderRadius: 30,
        borderWidth: 6,
        borderColor: COLORS.black,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mockStatus: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.black,
        borderRadius: 2,
        position: 'absolute',
        top: 10,
    },
    mockText: {
        fontSize: 18,
        fontFamily: FONTS.bold,
        textAlign: 'center',
        marginTop: 20,
    },
    mockSubtext: {
        fontSize: 12,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        marginTop: 8,
    },
    mockButton: {
        width: 50,
        height: 10,
        backgroundColor: COLORS.divider,
        borderRadius: 5,
        marginTop: 30,
    },
    permissionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 15,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    privacyNoteFull: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        textAlign: 'center',
        marginTop: 30,
        lineHeight: 22,
    },
    centerIllustration: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    privacyNoteSmall: {
        fontSize: 12,
        color: COLORS.tertiaryText,
        textAlign: 'center',
        marginTop: 15,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
    },
    prayerTimeCard: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    prayerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    prayerName: {
        fontSize: 20,
        fontFamily: FONTS.medium,
        color: COLORS.black,
    },
    prayerArabic: {
        fontSize: 18,
        color: COLORS.tertiaryText,
    },
    prayerTime: {
        fontSize: 32,
        fontFamily: FONTS.primary,
        color: COLORS.black,
        marginTop: 5,
    },
    skipText: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.tertiaryText,
        textAlign: 'center',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    successRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    successText: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        marginLeft: 12,
        color: COLORS.black,
    },
    dividerLarge: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginVertical: 20,
    },
    nextPrayerLabel: {
        fontSize: 14,
        color: COLORS.secondaryText,
        fontFamily: FONTS.medium,
    },
    nextPrayerValue: {
        fontSize: 22,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginTop: 4,
    },
    progressContainer: {
        height: 4,
        backgroundColor: COLORS.divider,
        width: '100%',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.black,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 10 : 20,
        backgroundColor: COLORS.white,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 50,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.offWhite,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 40,
    },
    // --- SCREEN TIME STYLES ---
    activeLockBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.black,
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
    },
    activeLockIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeLockTitle: {
        fontSize: 16,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
    activeLockSubtitle: {
        fontSize: 13,
        fontFamily: FONTS.primary,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 2,
    },
    unlockNowButton: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    unlockNowButtonText: {
        fontSize: 14,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
    selectionStatusCard: {
        width: '100%',
        padding: 20,
        backgroundColor: COLORS.offWhite,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.divider,
        marginTop: 20,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 15,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
    },
    durationSelector: {
        flexDirection: 'row',
        backgroundColor: COLORS.offWhite,
        borderRadius: 12,
        padding: 4,
    },
    durationOption: {
        width: 65,
        height: 36,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.divider,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 3,
    },
    durationOptionSelected: {
        backgroundColor: COLORS.black,
        borderColor: COLORS.black,
    },
    durationText: {
        fontSize: 13,
        fontFamily: FONTS.medium,
        color: COLORS.black,
    },
    durationTextSelected: {
        color: COLORS.white,
        fontFamily: FONTS.bold,
    },
    testLockButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.divider,
        borderStyle: 'dashed',
    },
    testLockButtonText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        marginLeft: 8,
    },
    lockedBanner: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.divider,
        alignItems: 'center',
        width: '100%',
    },
    lockedBannerText: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        marginBottom: 15,
    },
    iHavePrayedButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
    },
    iHavePrayedButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontFamily: FONTS.bold,
    },
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    successCard: {
        alignItems: 'center',
        width: '100%',
    },
    successTitle: {
        fontSize: 32,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginTop: 20,
    },
    successSubtitle: {
        fontSize: 18,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        marginTop: 5,
        textAlign: 'center',
    },
    quranVerseContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    quranVerse: {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.black,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 24,
    },
    quranCitation: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        marginTop: 10,
    },
    // --- NEW STYLES ---
    arabicGreeting: {
        fontSize: 48,
        color: COLORS.black,
        fontFamily: FONTS.bold,
        marginBottom: 8,
        textAlign: 'center',
    },
    transliteratedGreeting: {
        fontSize: 18,
        color: COLORS.secondaryText,
        fontFamily: FONTS.medium,
        marginBottom: 20,
        textAlign: 'center',
    },
    greetingDivider: {
        width: 40,
        height: 2,
        backgroundColor: COLORS.divider,
        marginBottom: 30,
    },
    beginButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.black,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    beginButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontFamily: FONTS.bold,
        marginRight: 10,
    },
    frequencyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
        marginTop: 30,
        marginBottom: 20,
    },
    frequencyCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: COLORS.divider,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
    },
    frequencyCircleSelected: {
        backgroundColor: COLORS.black,
        borderColor: COLORS.black,
    },
    frequencyNumber: {
        fontSize: 24,
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },
    frequencyNumberSelected: {
        color: COLORS.white,
    },
    journalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 15,
        gap: 12,
    },
    clearJournalButton: {
        height: 44,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.divider,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearJournalText: {
        color: COLORS.secondaryText,
        fontFamily: FONTS.medium,
        fontSize: 14,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
    },
    entryCount: {
        fontSize: 14,
        color: COLORS.tertiaryText,
        fontFamily: FONTS.medium,
    },
    journalHistoryScroll: {
        flex: 1,
        marginTop: 10,
    },
    journalEntryCard: {
        backgroundColor: COLORS.offWhite,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },
    journalEntryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    journalEntryTimestamp: {
        fontSize: 12,
        color: COLORS.tertiaryText,
        fontFamily: FONTS.medium,
        textTransform: 'uppercase',
    },
    journalEntryPreview: {
        fontSize: 15,
        color: COLORS.black,
        fontFamily: FONTS.primary,
        lineHeight: 22,
    },
    journalEntryFullText: {
        lineHeight: 24,
    },
    readMoreText: {
        fontSize: 13,
        color: COLORS.accent,
        fontFamily: FONTS.bold,
        marginTop: 8,
    },
    // --- NEW ONBOARDING STYLES ---
    summaryCard: {
        backgroundColor: COLORS.offWhite,
        padding: 20,
        borderRadius: 16,
    },
    summaryLabel: {
        fontSize: 12,
        fontFamily: FONTS.medium,
        color: COLORS.tertiaryText,
        marginBottom: 8,
    },
    summaryContent: {
        fontSize: 18,
        fontFamily: FONTS.demi,
        color: COLORS.black,
    },
    progressRing: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressPercent: {
        position: 'absolute',
        fontSize: 48,
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },
    stepDots: {
        flexDirection: 'row',
        marginTop: 30,
        gap: 8,
    },
    stepDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.divider,
    },
    stepDotActive: {
        backgroundColor: COLORS.black,
    },
    buildLoadingText: {
        fontSize: 18,
        fontFamily: FONTS.demi,
        color: COLORS.black,
        marginTop: 30,
    },
    sectionHeader: {
        fontSize: 18,
        fontFamily: FONTS.demi,
        color: COLORS.black,
    },
    dayCard: {
        backgroundColor: COLORS.offWhite,
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
    },
    dayTitle: {
        fontSize: 16,
        fontFamily: FONTS.demi,
        color: COLORS.black,
    },
    dayDesc: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginTop: 4,
    },
    dividerLine: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginTop: 30,
    },
    timelineItem: {
        fontSize: 14,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        marginBottom: 12,
        lineHeight: 22,
    },
    planContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    planCard: {
        flex: 1,
        backgroundColor: COLORS.offWhite,
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
    },
    planCardSelected: {
        borderColor: COLORS.black,
        backgroundColor: COLORS.white,
    },
    planLabel: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
    },
    planPrice: {
        fontSize: 20,
        fontFamily: FONTS.bold,
        color: COLORS.black,
        marginTop: 8,
    },
    planSubtext: {
        fontSize: 12,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        marginTop: 4,
    },
    trialBadge: {
        backgroundColor: COLORS.black,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    trialBadgeText: {
        fontSize: 10,
        fontFamily: FONTS.medium,
        color: COLORS.white,
    },
    privacyNoticeText: {
        fontSize: 12,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        textAlign: 'center',
        marginTop: 16,
    },
    finePrint: {
        fontSize: 12,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
        textAlign: 'center',
        marginTop: 12,
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        gap: 8,
    },
    footerLink: {
        fontSize: 12,
        fontFamily: FONTS.primary,
        color: COLORS.tertiaryText,
    },
    footerDivider: {
        color: COLORS.tertiaryText,
    },
    // Instruction Screen Styles
    instructionCardsContainer: {
        marginTop: 30,
    },
    instructionCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 20,
        marginBottom: 16,
        borderRadius: 20,
    },
    instructionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    instructionTextContainer: {
        flex: 1,
    },
    instructionTitle: {
        fontSize: 17,
        fontFamily: FONTS.demi,
        color: COLORS.black,
        marginBottom: 6,
    },
    instructionDescription: {
        fontSize: 15,
        fontFamily: FONTS.primary,
        color: COLORS.secondaryText,
        lineHeight: 22,
    },
    // Milestone Styles for Progress Tab
    milestoneSection: {
        marginTop: 30,
    },
    milestoneSectionTitle: {
        fontSize: 16,
        fontFamily: FONTS.demi,
        color: COLORS.secondaryText,
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    milestoneCardLocked: {
        opacity: 0.5,
    },
    milestoneProgress: {
        marginTop: 10,
    },
    milestoneProgressBar: {
        height: 6,
        backgroundColor: COLORS.offWhite,
        borderRadius: 3,
        overflow: 'hidden',
    },
    milestoneProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    milestoneProgressText: {
        fontSize: 12,
        fontFamily: FONTS.medium,
        color: COLORS.secondaryText,
        marginTop: 6,
    },
    unlockedBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    unlockedBadgeText: {
        fontSize: 11,
        fontFamily: FONTS.bold,
        color: COLORS.accent,
    },
});
