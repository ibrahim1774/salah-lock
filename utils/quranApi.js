// Quran API utilities using api.alquran.cloud
const BASE_URL = 'https://api.alquran.cloud/v1';

/**
 * Fetch all Surahs (chapters) of the Quran
 * @returns {Promise<Array>} Array of Surah objects
 */
export const getAllSurahs = async () => {
    try {
        const response = await fetch(`${BASE_URL}/surah`);
        const data = await response.json();

        if (data.code === 200 && data.status === 'OK') {
            return data.data;
        }
        throw new Error('Failed to fetch Surahs');
    } catch (error) {
        console.error('Error fetching Surahs:', error);
        throw error;
    }
};

/**
 * Fetch a specific Surah with translation
 * @param {number} surahNumber - The Surah number (1-114)
 * @param {string} edition - Translation edition (default: en.asad)
 * @returns {Promise<Object>} Surah object with verses and translation
 */
export const getSurah = async (surahNumber, edition = 'en.asad') => {
    try {
        const response = await fetch(`${BASE_URL}/surah/${surahNumber}/${edition}`);
        const data = await response.json();

        if (data.code === 200 && data.status === 'OK') {
            return data.data;
        }
        throw new Error('Failed to fetch Surah');
    } catch (error) {
        console.error('Error fetching Surah:', error);
        throw error;
    }
};

/**
 * Fetch a Surah with both Arabic and translation
 * @param {number} surahNumber - The Surah number (1-114)
 * @param {string} translationEdition - Translation edition (default: en.asad)
 * @returns {Promise<Object>} Object with Arabic and translation
 */
export const getSurahWithTranslation = async (surahNumber, translationEdition = 'en.asad') => {
    try {
        // Fetch both Arabic and translation in parallel
        const [arabicResponse, translationResponse] = await Promise.all([
            fetch(`${BASE_URL}/surah/${surahNumber}`),
            fetch(`${BASE_URL}/surah/${surahNumber}/${translationEdition}`)
        ]);

        const arabicData = await arabicResponse.json();
        const translationData = await translationResponse.json();

        if (arabicData.code === 200 && translationData.code === 200) {
            // Combine Arabic and translation
            const combined = {
                ...arabicData.data,
                ayahs: arabicData.data.ayahs.map((ayah, index) => ({
                    number: ayah.number,
                    numberInSurah: ayah.numberInSurah,
                    arabic: ayah.text,
                    translation: translationData.data.ayahs[index]?.text || '',
                }))
            };
            return combined;
        }
        throw new Error('Failed to fetch Surah with translation');
    } catch (error) {
        console.error('Error fetching Surah with translation:', error);
        throw error;
    }
};

/**
 * Get Surah metadata
 * @param {number} surahNumber - The Surah number (1-114)
 * @returns {Object} Surah metadata
 */
export const getSurahMetadata = (surahNumber) => {
    const metadata = SURAH_METADATA[surahNumber];
    if (!metadata) {
        throw new Error(`Invalid Surah number: ${surahNumber}`);
    }
    return metadata;
};

/**
 * Available translation editions
 */
export const TRANSLATION_EDITIONS = {
    'en.asad': 'English - Muhammad Asad',
    'en.sahih': 'English - Sahih International',
    'en.yusufali': 'English - Yusuf Ali',
    'en.pickthall': 'English - Pickthall',
    'en.hilali': 'English - Hilali & Khan',
};

/**
 * Static metadata for all Surahs (for offline use and quick access)
 */
export const SURAH_METADATA = {
    1: { number: 1, name: 'Al-Fatihah', englishName: 'The Opening', arabicName: 'الفاتحة', revelationType: 'Meccan', numberOfAyahs: 7 },
    2: { number: 2, name: 'Al-Baqarah', englishName: 'The Cow', arabicName: 'البقرة', revelationType: 'Medinan', numberOfAyahs: 286 },
    3: { number: 3, name: 'Ali \'Imran', englishName: 'Family of Imran', arabicName: 'آل عمران', revelationType: 'Medinan', numberOfAyahs: 200 },
    4: { number: 4, name: 'An-Nisa', englishName: 'The Women', arabicName: 'النساء', revelationType: 'Medinan', numberOfAyahs: 176 },
    5: { number: 5, name: 'Al-Ma\'idah', englishName: 'The Table Spread', arabicName: 'المائدة', revelationType: 'Medinan', numberOfAyahs: 120 },
    6: { number: 6, name: 'Al-An\'am', englishName: 'The Cattle', arabicName: 'الأنعام', revelationType: 'Meccan', numberOfAyahs: 165 },
    7: { number: 7, name: 'Al-A\'raf', englishName: 'The Heights', arabicName: 'الأعراف', revelationType: 'Meccan', numberOfAyahs: 206 },
    8: { number: 8, name: 'Al-Anfal', englishName: 'The Spoils of War', arabicName: 'الأنفال', revelationType: 'Medinan', numberOfAyahs: 75 },
    9: { number: 9, name: 'At-Tawbah', englishName: 'The Repentance', arabicName: 'التوبة', revelationType: 'Medinan', numberOfAyahs: 129 },
    10: { number: 10, name: 'Yunus', englishName: 'Jonah', arabicName: 'يونس', revelationType: 'Meccan', numberOfAyahs: 109 },
    11: { number: 11, name: 'Hud', englishName: 'Hud', arabicName: 'هود', revelationType: 'Meccan', numberOfAyahs: 123 },
    12: { number: 12, name: 'Yusuf', englishName: 'Joseph', arabicName: 'يوسف', revelationType: 'Meccan', numberOfAyahs: 111 },
    13: { number: 13, name: 'Ar-Ra\'d', englishName: 'The Thunder', arabicName: 'الرعد', revelationType: 'Medinan', numberOfAyahs: 43 },
    14: { number: 14, name: 'Ibrahim', englishName: 'Abraham', arabicName: 'إبراهيم', revelationType: 'Meccan', numberOfAyahs: 52 },
    15: { number: 15, name: 'Al-Hijr', englishName: 'The Rocky Tract', arabicName: 'الحجر', revelationType: 'Meccan', numberOfAyahs: 99 },
    16: { number: 16, name: 'An-Nahl', englishName: 'The Bee', arabicName: 'النحل', revelationType: 'Meccan', numberOfAyahs: 128 },
    17: { number: 17, name: 'Al-Isra', englishName: 'The Night Journey', arabicName: 'الإسراء', revelationType: 'Meccan', numberOfAyahs: 111 },
    18: { number: 18, name: 'Al-Kahf', englishName: 'The Cave', arabicName: 'الكهف', revelationType: 'Meccan', numberOfAyahs: 110 },
    19: { number: 19, name: 'Maryam', englishName: 'Mary', arabicName: 'مريم', revelationType: 'Meccan', numberOfAyahs: 98 },
    20: { number: 20, name: 'Taha', englishName: 'Ta-Ha', arabicName: 'طه', revelationType: 'Meccan', numberOfAyahs: 135 },
    21: { number: 21, name: 'Al-Anbya', englishName: 'The Prophets', arabicName: 'الأنبياء', revelationType: 'Meccan', numberOfAyahs: 112 },
    22: { number: 22, name: 'Al-Hajj', englishName: 'The Pilgrimage', arabicName: 'الحج', revelationType: 'Medinan', numberOfAyahs: 78 },
    23: { number: 23, name: 'Al-Mu\'minun', englishName: 'The Believers', arabicName: 'المؤمنون', revelationType: 'Meccan', numberOfAyahs: 118 },
    24: { number: 24, name: 'An-Nur', englishName: 'The Light', arabicName: 'النور', revelationType: 'Medinan', numberOfAyahs: 64 },
    25: { number: 25, name: 'Al-Furqan', englishName: 'The Criterion', arabicName: 'الفرقان', revelationType: 'Meccan', numberOfAyahs: 77 },
    26: { number: 26, name: 'Ash-Shu\'ara', englishName: 'The Poets', arabicName: 'الشعراء', revelationType: 'Meccan', numberOfAyahs: 227 },
    27: { number: 27, name: 'An-Naml', englishName: 'The Ant', arabicName: 'النمل', revelationType: 'Meccan', numberOfAyahs: 93 },
    28: { number: 28, name: 'Al-Qasas', englishName: 'The Stories', arabicName: 'القصص', revelationType: 'Meccan', numberOfAyahs: 88 },
    29: { number: 29, name: 'Al-\'Ankabut', englishName: 'The Spider', arabicName: 'العنكبوت', revelationType: 'Meccan', numberOfAyahs: 69 },
    30: { number: 30, name: 'Ar-Rum', englishName: 'The Romans', arabicName: 'الروم', revelationType: 'Meccan', numberOfAyahs: 60 },
    31: { number: 31, name: 'Luqman', englishName: 'Luqman', arabicName: 'لقمان', revelationType: 'Meccan', numberOfAyahs: 34 },
    32: { number: 32, name: 'As-Sajdah', englishName: 'The Prostration', arabicName: 'السجدة', revelationType: 'Meccan', numberOfAyahs: 30 },
    33: { number: 33, name: 'Al-Ahzab', englishName: 'The Combined Forces', arabicName: 'الأحزاب', revelationType: 'Medinan', numberOfAyahs: 73 },
    34: { number: 34, name: 'Saba', englishName: 'Sheba', arabicName: 'سبأ', revelationType: 'Meccan', numberOfAyahs: 54 },
    35: { number: 35, name: 'Fatir', englishName: 'Originator', arabicName: 'فاطر', revelationType: 'Meccan', numberOfAyahs: 45 },
    36: { number: 36, name: 'Ya-Sin', englishName: 'Ya Sin', arabicName: 'يس', revelationType: 'Meccan', numberOfAyahs: 83 },
    37: { number: 37, name: 'As-Saffat', englishName: 'Those who set the Ranks', arabicName: 'الصافات', revelationType: 'Meccan', numberOfAyahs: 182 },
    38: { number: 38, name: 'Sad', englishName: 'The Letter Saad', arabicName: 'ص', revelationType: 'Meccan', numberOfAyahs: 88 },
    39: { number: 39, name: 'Az-Zumar', englishName: 'The Troops', arabicName: 'الزمر', revelationType: 'Meccan', numberOfAyahs: 75 },
    40: { number: 40, name: 'Ghafir', englishName: 'The Forgiver', arabicName: 'غافر', revelationType: 'Meccan', numberOfAyahs: 85 },
    41: { number: 41, name: 'Fussilat', englishName: 'Explained in Detail', arabicName: 'فصلت', revelationType: 'Meccan', numberOfAyahs: 54 },
    42: { number: 42, name: 'Ash-Shuraa', englishName: 'The Consultation', arabicName: 'الشورى', revelationType: 'Meccan', numberOfAyahs: 53 },
    43: { number: 43, name: 'Az-Zukhruf', englishName: 'The Ornaments of Gold', arabicName: 'الزخرف', revelationType: 'Meccan', numberOfAyahs: 89 },
    44: { number: 44, name: 'Ad-Dukhan', englishName: 'The Smoke', arabicName: 'الدخان', revelationType: 'Meccan', numberOfAyahs: 59 },
    45: { number: 45, name: 'Al-Jathiyah', englishName: 'The Crouching', arabicName: 'الجاثية', revelationType: 'Meccan', numberOfAyahs: 37 },
    46: { number: 46, name: 'Al-Ahqaf', englishName: 'The Wind-Curved Sandhills', arabicName: 'الأحقاف', revelationType: 'Meccan', numberOfAyahs: 35 },
    47: { number: 47, name: 'Muhammad', englishName: 'Muhammad', arabicName: 'محمد', revelationType: 'Medinan', numberOfAyahs: 38 },
    48: { number: 48, name: 'Al-Fath', englishName: 'The Victory', arabicName: 'الفتح', revelationType: 'Medinan', numberOfAyahs: 29 },
    49: { number: 49, name: 'Al-Hujurat', englishName: 'The Rooms', arabicName: 'الحجرات', revelationType: 'Medinan', numberOfAyahs: 18 },
    50: { number: 50, name: 'Qaf', englishName: 'The Letter Qaf', arabicName: 'ق', revelationType: 'Meccan', numberOfAyahs: 45 },
    51: { number: 51, name: 'Adh-Dhariyat', englishName: 'The Winnowing Winds', arabicName: 'الذاريات', revelationType: 'Meccan', numberOfAyahs: 60 },
    52: { number: 52, name: 'At-Tur', englishName: 'The Mount', arabicName: 'الطور', revelationType: 'Meccan', numberOfAyahs: 49 },
    53: { number: 53, name: 'An-Najm', englishName: 'The Star', arabicName: 'النجم', revelationType: 'Meccan', numberOfAyahs: 62 },
    54: { number: 54, name: 'Al-Qamar', englishName: 'The Moon', arabicName: 'القمر', revelationType: 'Meccan', numberOfAyahs: 55 },
    55: { number: 55, name: 'Ar-Rahman', englishName: 'The Beneficent', arabicName: 'الرحمن', revelationType: 'Medinan', numberOfAyahs: 78 },
    56: { number: 56, name: 'Al-Waqi\'ah', englishName: 'The Inevitable', arabicName: 'الواقعة', revelationType: 'Meccan', numberOfAyahs: 96 },
    57: { number: 57, name: 'Al-Hadid', englishName: 'The Iron', arabicName: 'الحديد', revelationType: 'Medinan', numberOfAyahs: 29 },
    58: { number: 58, name: 'Al-Mujadila', englishName: 'The Pleading Woman', arabicName: 'المجادلة', revelationType: 'Medinan', numberOfAyahs: 22 },
    59: { number: 59, name: 'Al-Hashr', englishName: 'The Exile', arabicName: 'الحشر', revelationType: 'Medinan', numberOfAyahs: 24 },
    60: { number: 60, name: 'Al-Mumtahanah', englishName: 'She that is to be examined', arabicName: 'الممتحنة', revelationType: 'Medinan', numberOfAyahs: 13 },
    61: { number: 61, name: 'As-Saf', englishName: 'The Ranks', arabicName: 'الصف', revelationType: 'Medinan', numberOfAyahs: 14 },
    62: { number: 62, name: 'Al-Jumu\'ah', englishName: 'Friday', arabicName: 'الجمعة', revelationType: 'Medinan', numberOfAyahs: 11 },
    63: { number: 63, name: 'Al-Munafiqun', englishName: 'The Hypocrites', arabicName: 'المنافقون', revelationType: 'Medinan', numberOfAyahs: 11 },
    64: { number: 64, name: 'At-Taghabun', englishName: 'The Mutual Disillusion', arabicName: 'التغابن', revelationType: 'Medinan', numberOfAyahs: 18 },
    65: { number: 65, name: 'At-Talaq', englishName: 'The Divorce', arabicName: 'الطلاق', revelationType: 'Medinan', numberOfAyahs: 12 },
    66: { number: 66, name: 'At-Tahrim', englishName: 'The Prohibition', arabicName: 'التحريم', revelationType: 'Medinan', numberOfAyahs: 12 },
    67: { number: 67, name: 'Al-Mulk', englishName: 'The Sovereignty', arabicName: 'الملك', revelationType: 'Meccan', numberOfAyahs: 30 },
    68: { number: 68, name: 'Al-Qalam', englishName: 'The Pen', arabicName: 'القلم', revelationType: 'Meccan', numberOfAyahs: 52 },
    69: { number: 69, name: 'Al-Haqqah', englishName: 'The Reality', arabicName: 'الحاقة', revelationType: 'Meccan', numberOfAyahs: 52 },
    70: { number: 70, name: 'Al-Ma\'arij', englishName: 'The Ascending Stairways', arabicName: 'المعارج', revelationType: 'Meccan', numberOfAyahs: 44 },
    71: { number: 71, name: 'Nuh', englishName: 'Noah', arabicName: 'نوح', revelationType: 'Meccan', numberOfAyahs: 28 },
    72: { number: 72, name: 'Al-Jinn', englishName: 'The Jinn', arabicName: 'الجن', revelationType: 'Meccan', numberOfAyahs: 28 },
    73: { number: 73, name: 'Al-Muzzammil', englishName: 'The Enshrouded One', arabicName: 'المزمل', revelationType: 'Meccan', numberOfAyahs: 20 },
    74: { number: 74, name: 'Al-Muddaththir', englishName: 'The Cloaked One', arabicName: 'المدثر', revelationType: 'Meccan', numberOfAyahs: 56 },
    75: { number: 75, name: 'Al-Qiyamah', englishName: 'The Resurrection', arabicName: 'القيامة', revelationType: 'Meccan', numberOfAyahs: 40 },
    76: { number: 76, name: 'Al-Insan', englishName: 'The Man', arabicName: 'الإنسان', revelationType: 'Medinan', numberOfAyahs: 31 },
    77: { number: 77, name: 'Al-Mursalat', englishName: 'The Emissaries', arabicName: 'المرسلات', revelationType: 'Meccan', numberOfAyahs: 50 },
    78: { number: 78, name: 'An-Naba', englishName: 'The Tidings', arabicName: 'النبأ', revelationType: 'Meccan', numberOfAyahs: 40 },
    79: { number: 79, name: 'An-Nazi\'at', englishName: 'Those who drag forth', arabicName: 'النازعات', revelationType: 'Meccan', numberOfAyahs: 46 },
    80: { number: 80, name: '\'Abasa', englishName: 'He Frowned', arabicName: 'عبس', revelationType: 'Meccan', numberOfAyahs: 42 },
    81: { number: 81, name: 'At-Takwir', englishName: 'The Overthrowing', arabicName: 'التكوير', revelationType: 'Meccan', numberOfAyahs: 29 },
    82: { number: 82, name: 'Al-Infitar', englishName: 'The Cleaving', arabicName: 'الإنفطار', revelationType: 'Meccan', numberOfAyahs: 19 },
    83: { number: 83, name: 'Al-Mutaffifin', englishName: 'The Defrauding', arabicName: 'المطففين', revelationType: 'Meccan', numberOfAyahs: 36 },
    84: { number: 84, name: 'Al-Inshiqaq', englishName: 'The Sundering', arabicName: 'الإنشقاق', revelationType: 'Meccan', numberOfAyahs: 25 },
    85: { number: 85, name: 'Al-Buruj', englishName: 'The Mansions of the Stars', arabicName: 'البروج', revelationType: 'Meccan', numberOfAyahs: 22 },
    86: { number: 86, name: 'At-Tariq', englishName: 'The Nightcommer', arabicName: 'الطارق', revelationType: 'Meccan', numberOfAyahs: 17 },
    87: { number: 87, name: 'Al-A\'la', englishName: 'The Most High', arabicName: 'الأعلى', revelationType: 'Meccan', numberOfAyahs: 19 },
    88: { number: 88, name: 'Al-Ghashiyah', englishName: 'The Overwhelming', arabicName: 'الغاشية', revelationType: 'Meccan', numberOfAyahs: 26 },
    89: { number: 89, name: 'Al-Fajr', englishName: 'The Dawn', arabicName: 'الفجر', revelationType: 'Meccan', numberOfAyahs: 30 },
    90: { number: 90, name: 'Al-Balad', englishName: 'The City', arabicName: 'البلد', revelationType: 'Meccan', numberOfAyahs: 20 },
    91: { number: 91, name: 'Ash-Shams', englishName: 'The Sun', arabicName: 'الشمس', revelationType: 'Meccan', numberOfAyahs: 15 },
    92: { number: 92, name: 'Al-Layl', englishName: 'The Night', arabicName: 'الليل', revelationType: 'Meccan', numberOfAyahs: 21 },
    93: { number: 93, name: 'Ad-Duhaa', englishName: 'The Morning Hours', arabicName: 'الضحى', revelationType: 'Meccan', numberOfAyahs: 11 },
    94: { number: 94, name: 'Ash-Sharh', englishName: 'The Relief', arabicName: 'الشرح', revelationType: 'Meccan', numberOfAyahs: 8 },
    95: { number: 95, name: 'At-Tin', englishName: 'The Fig', arabicName: 'التين', revelationType: 'Meccan', numberOfAyahs: 8 },
    96: { number: 96, name: 'Al-\'Alaq', englishName: 'The Clot', arabicName: 'العلق', revelationType: 'Meccan', numberOfAyahs: 19 },
    97: { number: 97, name: 'Al-Qadr', englishName: 'The Power', arabicName: 'القدر', revelationType: 'Meccan', numberOfAyahs: 5 },
    98: { number: 98, name: 'Al-Bayyinah', englishName: 'The Clear Proof', arabicName: 'البينة', revelationType: 'Medinan', numberOfAyahs: 8 },
    99: { number: 99, name: 'Az-Zalzalah', englishName: 'The Earthquake', arabicName: 'الزلزلة', revelationType: 'Medinan', numberOfAyahs: 8 },
    100: { number: 100, name: 'Al-\'Adiyat', englishName: 'The Courser', arabicName: 'العاديات', revelationType: 'Meccan', numberOfAyahs: 11 },
    101: { number: 101, name: 'Al-Qari\'ah', englishName: 'The Calamity', arabicName: 'القارعة', revelationType: 'Meccan', numberOfAyahs: 11 },
    102: { number: 102, name: 'At-Takathur', englishName: 'The Rivalry in world increase', arabicName: 'التكاثر', revelationType: 'Meccan', numberOfAyahs: 8 },
    103: { number: 103, name: 'Al-\'Asr', englishName: 'The Declining Day', arabicName: 'العصر', revelationType: 'Meccan', numberOfAyahs: 3 },
    104: { number: 104, name: 'Al-Humazah', englishName: 'The Traducer', arabicName: 'الهمزة', revelationType: 'Meccan', numberOfAyahs: 9 },
    105: { number: 105, name: 'Al-Fil', englishName: 'The Elephant', arabicName: 'الفيل', revelationType: 'Meccan', numberOfAyahs: 5 },
    106: { number: 106, name: 'Quraysh', englishName: 'Quraysh', arabicName: 'قريش', revelationType: 'Meccan', numberOfAyahs: 4 },
    107: { number: 107, name: 'Al-Ma\'un', englishName: 'The Small kindnesses', arabicName: 'الماعون', revelationType: 'Meccan', numberOfAyahs: 7 },
    108: { number: 108, name: 'Al-Kawthar', englishName: 'The Abundance', arabicName: 'الكوثر', revelationType: 'Meccan', numberOfAyahs: 3 },
    109: { number: 109, name: 'Al-Kafirun', englishName: 'The Disbelievers', arabicName: 'الكافرون', revelationType: 'Meccan', numberOfAyahs: 6 },
    110: { number: 110, name: 'An-Nasr', englishName: 'The Divine Support', arabicName: 'النصر', revelationType: 'Medinan', numberOfAyahs: 3 },
    111: { number: 111, name: 'Al-Masad', englishName: 'The Palm Fiber', arabicName: 'المسد', revelationType: 'Meccan', numberOfAyahs: 5 },
    112: { number: 112, name: 'Al-Ikhlas', englishName: 'The Sincerity', arabicName: 'الإخلاص', revelationType: 'Meccan', numberOfAyahs: 4 },
    113: { number: 113, name: 'Al-Falaq', englishName: 'The Daybreak', arabicName: 'الفلق', revelationType: 'Meccan', numberOfAyahs: 5 },
    114: { number: 114, name: 'An-Nas', englishName: 'Mankind', arabicName: 'الناس', revelationType: 'Meccan', numberOfAyahs: 6 },
};
