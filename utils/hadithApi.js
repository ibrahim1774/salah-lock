// Hadith API utilities
// Note: sunnah.com API is free but may have rate limits
// For production, consider implementing caching and offline support

const BASE_URL = 'https://api.sunnah.com/v1';

/**
 * Hadith collections metadata
 */
export const HADITH_COLLECTIONS = [
    {
        id: 'bukhari',
        name: 'Sahih al-Bukhari',
        arabicName: 'صحيح البخاري',
        totalHadith: 7563,
        description: 'The most authentic collection',
        color: '#92400E',
        icon: 'book'
    }
];

/**
 * Mock data for Hadith books (chapters) since API may require authentication
 * This is a sample structure - in production, this would come from the API
 */
export const BUKHARI_BOOKS = [
    { number: 1, name: 'Revelation', hadithCount: 7 },
    { number: 2, name: 'Belief', hadithCount: 53 },
    { number: 3, name: 'Knowledge', hadithCount: 76 },
    { number: 4, name: 'Ablutions (Wudu)', hadithCount: 113 },
    { number: 5, name: 'Bathing (Ghusl)', hadithCount: 31 },
    { number: 6, name: 'Menstrual Periods', hadithCount: 33 },
    { number: 7, name: 'Rubbing hands and feet with dust (Tayammum)', hadithCount: 14 },
    { number: 8, name: 'Prayers (Salat)', hadithCount: 155 },
    { number: 9, name: 'Virtues of the Prayer Hall (Sutra of the Musalla)', hadithCount: 14 },
    { number: 10, name: 'Times of the Prayers', hadithCount: 57 },
    { number: 11, name: 'Call to Prayers (Adhaan)', hadithCount: 124 },
    { number: 12, name: 'Characteristics of Prayer', hadithCount: 122 },
    { number: 13, name: 'Friday Prayer', hadithCount: 66 },
    { number: 14, name: 'Fear Prayer', hadithCount: 10 },
    { number: 15, name: 'The Two Festivals (Eids)', hadithCount: 31 },
    { number: 16, name: 'Witr Prayer', hadithCount: 6 },
    { number: 17, name: 'Invoking Allah for Rain (Istisqaa)', hadithCount: 39 },
    { number: 18, name: 'Eclipses', hadithCount: 29 },
    { number: 19, name: 'Prostration During Recital of Quran', hadithCount: 10 },
    { number: 20, name: 'Shortening the Prayers (At-Taqseer)', hadithCount: 25 },
    { number: 21, name: 'Prayer at Night (Tahajjud)', hadithCount: 75 },
    { number: 22, name: 'Actions while Praying', hadithCount: 121 },
    { number: 23, name: 'Funerals (Al-Janaa\'iz)', hadithCount: 100 },
    { number: 24, name: 'Obligatory Charity Tax (Zakat)', hadithCount: 75 },
    { number: 25, name: 'Obligatory Charity Tax After Ramadaan (Zakat ul Fitr)', hadithCount: 9 },
    { number: 26, name: 'Pilgrimage (Hajj)', hadithCount: 164 },
    { number: 27, name: 'Minor Pilgrimage (Umra)', hadithCount: 35 },
    { number: 28, name: 'Pilgrims Prevented from Completing the Pilgrimage', hadithCount: 11 },
    { number: 29, name: 'Penalty of Hunting while on Pilgrimage', hadithCount: 17 },
    { number: 30, name: 'Virtues of Madinah', hadithCount: 13 },
    { number: 31, name: 'Fasting', hadithCount: 86 },
    { number: 32, name: 'Praying at Night in Ramadaan (Taraweeh)', hadithCount: 11 },
    { number: 33, name: 'Retiring to a Mosque for Remembrance of Allah (I\'tikaf)', hadithCount: 19 },
    { number: 34, name: 'Sales and Trade', hadithCount: 112 },
    { number: 35, name: 'Sales in which a Price is paid for Goods to be Delivered Later (As-Salam)', hadithCount: 11 },
    { number: 36, name: 'Hiring', hadithCount: 23 },
    { number: 37, name: 'Transferance of a Debt from One Person to Another (Al-Hawaala)', hadithCount: 5 },
    { number: 38, name: 'Representation, Authorization, Business by Proxy', hadithCount: 16 },
    { number: 39, name: 'Agriculture', hadithCount: 36 },
    { number: 40, name: 'Distribution of Water', hadithCount: 16 },
    { number: 41, name: 'Loans, Payment of Loans, Freezing of Property, Bankruptcy', hadithCount: 30 },
    { number: 42, name: 'Lost Things Picked up by Someone (Luqaata)', hadithCount: 27 },
    { number: 43, name: 'Oppressions', hadithCount: 45 },
    { number: 44, name: 'Partnership', hadithCount: 8 },
    { number: 45, name: 'Mortgaging', hadithCount: 8 },
    { number: 46, name: 'Manumission of Slaves', hadithCount: 28 },
    { number: 47, name: 'Gifts', hadithCount: 37 },
    { number: 48, name: 'Witnesses', hadithCount: 31 },
    { number: 49, name: 'Peacemaking', hadithCount: 12 },
    { number: 50, name: 'Conditions', hadithCount: 29 },
    { number: 51, name: 'Wills and Testaments (Wasaayaa)', hadithCount: 37 },
    { number: 52, name: 'Fighting for the Cause of Allah (Jihaad)', hadithCount: 310 },
    { number: 53, name: 'One-fifth of Booty to the Cause of Allah (Khumus)', hadithCount: 44 },
    { number: 54, name: 'Beginning of Creation', hadithCount: 59 },
    { number: 55, name: 'Prophets', hadithCount: 117 },
    { number: 56, name: 'Virtues and Merits of the Prophet (pbuh) and his Companions', hadithCount: 202 },
    { number: 57, name: 'Companions of the Prophet', hadithCount: 158 },
    { number: 58, name: 'Merits of the Helpers in Madinah (Ansaar)', hadithCount: 51 },
    { number: 59, name: 'Military Expeditions led by the Prophet (pbuh) (Al-Maghaazi)', hadithCount: 88 },
    { number: 60, name: 'Prophetic Commentary on the Quran (Tafseer of the Prophet (pbuh))', hadithCount: 157 },
    { number: 61, name: 'Virtues of the Quran', hadithCount: 40 },
    { number: 62, name: 'Wedlock, Marriage (Nikaah)', hadithCount: 145 },
    { number: 63, name: 'Divorce', hadithCount: 74 },
    { number: 64, name: 'Supporting the Family', hadithCount: 15 },
    { number: 65, name: 'Food, Meals', hadithCount: 75 },
    { number: 66, name: 'Sacrifice on Occasion of Birth (`Aqiqa)', hadithCount: 4 },
    { number: 67, name: 'Hunting, Slaughtering', hadithCount: 43 },
    { number: 68, name: 'Al-Adha Festival Sacrifice (Adaahi)', hadithCount: 25 },
    { number: 69, name: 'Drinks', hadithCount: 28 },
    { number: 70, name: 'Patients', hadithCount: 58 },
    { number: 71, name: 'Medicine', hadithCount: 86 },
    { number: 72, name: 'Dress', hadithCount: 94 },
    { number: 73, name: 'Good Manners and Form (Al-Adab)', hadithCount: 228 },
    { number: 74, name: 'Asking Permission', hadithCount: 37 },
    { number: 75, name: 'Invocations', hadithCount: 75 },
    { number: 76, name: 'To make the Heart Tender (Ar-Riqaq)', hadithCount: 56 },
    { number: 77, name: 'Divine Will (Al-Qadar)', hadithCount: 15 },
    { number: 78, name: 'Oaths and Vows', hadithCount: 50 },
    { number: 79, name: 'Expiation for Unfulfilled Oaths', hadithCount: 8 },
    { number: 80, name: 'Laws of Inheritance (Al-Faraa\'id)', hadithCount: 38 },
    { number: 81, name: 'Limits and Punishments set by Allah (Hudood)', hadithCount: 35 },
    { number: 82, name: 'Punishment of Disbelievers at War with Allah and His Apostle', hadithCount: 20 },
    { number: 83, name: 'Blood Money (Ad-Diyat)', hadithCount: 45 },
    { number: 84, name: 'Dealing with Apostates', hadithCount: 12 },
    { number: 85, name: 'Saying Something under Compulsion (Ikraah)', hadithCount: 3 },
    { number: 86, name: 'Tricks', hadithCount: 21 },
    { number: 87, name: 'Interpretation of Dreams', hadithCount: 40 },
    { number: 88, name: 'Afflictions and the End of the World', hadithCount: 37 },
    { number: 89, name: 'Judgments (Ahkaam)', hadithCount: 30 },
    { number: 90, name: 'Wishes', hadithCount: 15 },
    { number: 91, name: 'Accepting Information Given by a Truthful Person', hadithCount: 10 },
    { number: 92, name: 'Holding Fast to the Quran and Sunnah', hadithCount: 50 },
    { number: 93, name: 'ONENESS, UNIQUENESS OF ALLAH (TAWHEED)', hadithCount: 61 }
];

/**
 * Sample Hadiths for offline/demo use
 */
export const SAMPLE_HADITHS = {
    bukhari: [
        {
            number: 1,
            book: 1,
            chapter: 'Revelation',
            english: 'Narrated \'Umar bin Al-Khattab: I heard Allah\'s Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for."',
            arabic: 'حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ، قَالَ حَدَّثَنَا سُفْيَانُ، قَالَ حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الأَنْصَارِيُّ، قَالَ أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ، أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ، يَقُولُ سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ ـ رضى الله عنه ـ عَلَى الْمِنْبَرِ قَالَ سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ ‏ "‏ إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
            grade: 'Sahih',
            reference: 'Sahih al-Bukhari 1'
        }
    ]
};

/**
 * Get all Hadith collections
 * @returns {Array} Array of Hadith collection objects
 */
export const getHadithCollections = () => {
    return HADITH_COLLECTIONS;
};

/**
 * Get books for a specific collection
 * @param {string} collectionId - Collection ID (e.g., 'bukhari')
 * @returns {Array} Array of books
 */
export const getHadithBooks = (collectionId) => {
    // For now, return Bukhari books as sample
    // In production, this would fetch from API or have data for all collections
    if (collectionId === 'bukhari') {
        return BUKHARI_BOOKS;
    }

    // Return empty array for other collections (to be implemented)
    return [];
};

/**
 * Get Hadiths for a specific book
 * @param {string} collectionId - Collection ID
 * @param {number} bookNumber - Book number
 * @returns {Array} Array of Hadith objects
 */
export const getHadithsByBook = (collectionId, bookNumber) => {
    // Return sample hadiths
    // In production, this would fetch from API or local database
    return SAMPLE_HADITHS[collectionId] || [];
};

/**
 * Search Hadiths by keyword
 * @param {string} query - Search query
 * @param {string} collectionId - Optional collection filter
 * @returns {Array} Array of matching Hadiths
 */
export const searchHadiths = (query, collectionId = null) => {
    // This is a mock implementation
    // In production, implement proper search with API or local database
    const allHadiths = collectionId
        ? SAMPLE_HADITHS[collectionId] || []
        : Object.values(SAMPLE_HADITHS).flat();

    return allHadiths.filter(hadith =>
        hadith.english.toLowerCase().includes(query.toLowerCase()) ||
        hadith.chapter.toLowerCase().includes(query.toLowerCase())
    );
};

/**
 * Get a single Hadith by reference
 * @param {string} collectionId - Collection ID
 * @param {number} hadithNumber - Hadith number
 * @returns {Object|null} Hadith object or null
 */
export const getHadithByNumber = (collectionId, hadithNumber) => {
    const hadiths = SAMPLE_HADITHS[collectionId] || [];
    return hadiths.find(h => h.number === hadithNumber) || null;
};
