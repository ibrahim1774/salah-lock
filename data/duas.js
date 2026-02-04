// Comprehensive collection of authentic Islamic Duas
// Organized by category for easy access

export const DUA_CATEGORIES = [
    {
        id: 'daily',
        name: 'Daily Duas',
        description: 'Morning, evening, and daily remembrances',
        icon: 'sunny',
        color: '#10B981'
    },
    {
        id: 'prayer',
        name: 'Prayer Related',
        description: 'Duas before, during, and after Salah',
        icon: 'person-outline',
        color: '#3B82F6'
    },
    {
        id: 'life_events',
        name: 'Life Events',
        description: 'For various occasions and situations',
        icon: 'calendar',
        color: '#8B5CF6'
    },
    {
        id: 'forgiveness',
        name: 'Seeking Forgiveness',
        description: 'Istighfar and repentance',
        icon: 'heart',
        color: '#EF4444'
    },
    {
        id: 'protection',
        name: 'Protection & Guidance',
        description: 'Seeking refuge and guidance',
        icon: 'shield-checkmark',
        color: '#F59E0B'
    },
    {
        id: 'special',
        name: 'Special Occasions',
        description: 'Ramadan, Eid, Hajj, and more',
        icon: 'star',
        color: '#EC4899'
    }
];

export const DUAS = [
    // ========== DAILY DUAS ==========
    {
        id: 'morning_1',
        category: 'daily',
        title: 'Morning Remembrance - Ayat al-Kursi',
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        transliteration: 'Allahu la ilaha illa Huwa, Al-Haiyul-Qaiyum. La ta\'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa\'u \'indahu illa bi-idhnih. Ya\'lamu ma baina aidihim wa ma khalfahum, wa la yuhituna bi shai\'im-min \'ilmihi illa bima sha\'a. Wasi\'a kursiyyuhus-samawati wal ard, wa la ya\'uduhu hifdhuhuma. Wa Huwal \'Aliyul-Adheem.',
        translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
        when: 'Recite after Fajr and in the morning',
        reference: 'Quran 2:255',
        benefits: 'Protection throughout the day, whoever recites this in the morning will be protected until evening'
    },
    {
        id: 'morning_2',
        category: 'daily',
        title: 'Morning Protection',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
        transliteration: 'Asbahna wa-asbahal-mulku lillah walhamdu lillah la ilaha illal-lahu wahdahu la sharika lah, lahul-mulku walahul-hamd, wahuwa \'ala kulli shay\'in qadir. Rabbi as\'aluka khayra ma fi hadhal-yawm, wa khayra ma ba\'dah, wa-a\'udhu bika min sharri ma fi hadhal-yawm, wa sharri ma ba\'dah, rabbi a\'udhu bika minal-kasal, wa su\'il kibar, rabbi a\'udhu bika min \'adhabin fin-nar, wa \'adhabin fil-qabr.',
        translation: 'We have entered a new morning and with it all the dominion is Allah\'s. Praise is to Allah. There is no god but Allah alone, Who has no partner. To Allah belongs the dominion, and to Allah belongs all praise, and He is able to do all things. My Lord, I ask You for the good of this day and the good that follows it, and I seek refuge in You from the evil of this day and the evil that follows it. My Lord, I seek refuge in You from laziness and senility. My Lord, I seek refuge in You from the punishment of the Fire and the punishment of the grave.',
        when: 'Every morning',
        reference: 'Sahih Muslim',
        benefits: 'Protection and seeking goodness for the day'
    },
    {
        id: 'morning_3',
        category: 'daily',
        title: 'SubhanAllah wa bihamdihi',
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        transliteration: 'SubhanAllahi wa bihamdihi',
        translation: 'Glory is to Allah and praise is to Him',
        when: 'Recite 100 times in the morning',
        reference: 'Sahih Bukhari',
        benefits: 'Sins will be forgiven even if they are like the foam of the sea'
    },
    {
        id: 'morning_4',
        category: 'daily',
        title: 'La hawla wa la quwwata',
        arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        transliteration: 'La hawla wa la quwwata illa billah',
        translation: 'There is no power and no strength except with Allah',
        when: 'Anytime, especially morning and evening',
        reference: 'Sahih Bukhari',
        benefits: 'A treasure from the treasures of Paradise'
    },
    {
        id: 'evening_1',
        category: 'daily',
        title: 'Evening Remembrance',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
        transliteration: 'Amsayna wa-amsal-mulku lillah walhamdu lillah la ilaha illal-lahu wahdahu la sharika lah, lahul-mulku walahul-hamd, wahuwa \'ala kulli shay\'in qadir. Rabbi as\'aluka khayra ma fi hadhihil-laylah, wa khayra ma ba\'daha, wa-a\'udhu bika min sharri ma fi hadhihil-laylah, wa sharri ma ba\'daha, rabbi a\'udhu bika minal-kasal, wa su\'il kibar, rabbi a\'udhu bika min \'adhabin fin-nar, wa \'adhabin fil-qabr.',
        translation: 'We have entered a new evening and with it all the dominion is Allah\'s. Praise is to Allah. There is no god but Allah alone, Who has no partner. To Allah belongs the dominion, and to Allah belongs all praise, and He is able to do all things. My Lord, I ask You for the good of this night and the good that follows it, and I seek refuge in You from the evil of this night and the evil that follows it. My Lord, I seek refuge in You from laziness and senility. My Lord, I seek refuge in You from the punishment of the Fire and the punishment of the grave.',
        when: 'Every evening',
        reference: 'Sahih Muslim',
        benefits: 'Protection and seeking goodness for the night'
    },
    {
        id: 'before_sleep_1',
        category: 'daily',
        title: 'Before Sleep - Surah Al-Ikhlas',
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Qul Huwa Allahu Ahad, Allahu Samad, lam yalid wa lam yulad, wa lam yakun lahu kufuwan ahad',
        translation: 'Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.',
        when: 'Before sleep (recite 3 times along with Al-Falaq and An-Nas)',
        reference: 'Quran 112',
        benefits: 'Protection throughout the night, equivalent to reading one-third of the Quran'
    },
    {
        id: 'before_sleep_2',
        category: 'daily',
        title: 'Before Sleep - Asking for Protection',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allahumma amutu wa ahya',
        translation: 'In Your name, O Allah, I die and I live',
        when: 'When going to bed',
        reference: 'Sahih Bukhari',
        benefits: 'Protection during sleep'
    },
    {
        id: 'waking_up_1',
        category: 'daily',
        title: 'Upon Waking Up',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur',
        translation: 'All praise is to Allah who gave us life after death and to Him is the resurrection',
        when: 'Upon waking up',
        reference: 'Sahih Bukhari',
        benefits: 'Gratitude for a new day of life'
    },
    {
        id: 'before_meal_1',
        category: 'daily',
        title: 'Before Eating',
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
        translation: 'In the name of Allah',
        when: 'Before eating or drinking',
        reference: 'Sunan Abu Dawud',
        benefits: 'Blessing in the food and protection from harm'
    },
    {
        id: 'after_meal_1',
        category: 'daily',
        title: 'After Eating',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
        transliteration: 'Alhamdu lillahil-ladhi at\'amana wa saqana wa ja\'alana Muslimin',
        translation: 'All praise is to Allah who has fed us and given us drink and made us Muslims',
        when: 'After finishing a meal',
        reference: 'Sunan Abu Dawud',
        benefits: 'Gratitude for sustenance'
    },
    {
        id: 'entering_home_1',
        category: 'daily',
        title: 'Entering the Home',
        arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
        transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa \'alallahi rabbina tawakkalna',
        translation: 'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust',
        when: 'When entering your home',
        reference: 'Sunan Abu Dawud',
        benefits: 'Blessing and protection for the household'
    },
    {
        id: 'leaving_home_1',
        category: 'daily',
        title: 'Leaving the Home',
        arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        transliteration: 'Bismillah, tawakkaltu \'alallah, wa la hawla wa la quwwata illa billah',
        translation: 'In the name of Allah, I place my trust in Allah, there is no might and no power except with Allah',
        when: 'When leaving your home',
        reference: 'Sunan Abu Dawud',
        benefits: 'You will be guided, protected, and sufficed'
    },

    // ========== PRAYER RELATED DUAS ==========
    {
        id: 'adhan_response_1',
        category: 'prayer',
        title: 'After the Adhan',
        arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
        transliteration: 'Allahumma Rabba hadhihid-da\'watit-tammah, was-salatil-qa\'imah, ati Muhammadan al-wasilata wal-fadilah, wab\'ath-hu maqaman mahmudanil-ladhi wa\'adtah',
        translation: 'O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favor, and raise him to the honored station You have promised him',
        when: 'After the call to prayer (Adhan)',
        reference: 'Sahih Bukhari',
        benefits: 'Intercession of the Prophet (ﷺ) will be guaranteed'
    },
    {
        id: 'opening_salah_1',
        category: 'prayer',
        title: 'Opening Supplication (Dua Al-Istiftah)',
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
        transliteration: 'Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta\'ala jadduka, wa la ilaha ghayruk',
        translation: 'Glory is to You, O Allah, and praise. Blessed is Your Name and Exalted is Your Majesty. There is no god but You',
        when: 'After Takbir (Allahu Akbar) at the start of prayer',
        reference: 'Sunan Abu Dawud',
        benefits: 'Opening the prayer with glorification of Allah'
    },
    {
        id: 'ruku_1',
        category: 'prayer',
        title: 'In Ruku (Bowing)',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        transliteration: 'Subhana Rabbiyal-Adheem',
        translation: 'Glory is to my Lord, the Most Great',
        when: 'During Ruku (bowing position)',
        reference: 'Sahih Muslim',
        benefits: 'Mandatory glorification during prayer'
    },
    {
        id: 'sujud_1',
        category: 'prayer',
        title: 'In Sujud (Prostration)',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: 'Subhana Rabbiyal-A\'la',
        translation: 'Glory is to my Lord, the Most High',
        when: 'During Sujud (prostration)',
        reference: 'Sahih Muslim',
        benefits: 'Mandatory glorification during prayer'
    },
    {
        id: 'sujud_dua_1',
        category: 'prayer',
        title: 'Dua in Sujud',
        arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ',
        transliteration: 'Allahumma-ghfir li dhanbi kullahu, diqqahu wa jillahu, wa awwalahu wa akhirahu, wa \'alaniyatahu wa sirrahu',
        translation: 'O Allah, forgive me all my sins, the small and the great, the first and the last, the open and the secret',
        when: 'During Sujud (prostration)',
        reference: 'Sahih Muslim',
        benefits: 'The closest a servant is to Allah is during prostration'
    },
    {
        id: 'after_tashahhud_1',
        category: 'prayer',
        title: 'After Tashahhud',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ جَهَنَّمَ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
        transliteration: 'Allahumma inni a\'udhu bika min \'adhabil-qabr, wa min \'adhabi jahannam, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal',
        translation: 'O Allah, I seek refuge in You from the punishment of the grave, from the punishment of Hell, from the trials of life and death, and from the evil of the trial of the False Messiah',
        when: 'After the final Tashahhud before Tasleem',
        reference: 'Sahih Bukhari',
        benefits: 'Protection from major trials'
    },
    {
        id: 'after_salah_1',
        category: 'prayer',
        title: 'After Salah - Ayat al-Kursi',
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
        transliteration: 'Allahu la ilaha illa Huwa, Al-Haiyul-Qaiyum',
        translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer',
        when: 'After completing Salah',
        reference: 'Sahih Bukhari',
        benefits: 'Nothing will prevent you from entering Paradise except death'
    },
    {
        id: 'after_salah_2',
        category: 'prayer',
        title: 'After Salah - Tasbih',
        arabic: 'سُبْحَانَ اللَّهِ (33x), الْحَمْدُ لِلَّهِ (33x), اللَّهُ أَكْبَرُ (33x)',
        transliteration: 'SubhanAllah (33x), Alhamdulillah (33x), Allahu Akbar (33x)',
        translation: 'Glory be to Allah (33x), All praise is to Allah (33x), Allah is the Greatest (33x)',
        when: 'After completing Salah',
        reference: 'Sahih Muslim',
        benefits: 'Sins will be forgiven even if they are like the foam of the sea'
    },
    {
        id: 'qunut_1',
        category: 'prayer',
        title: 'Dua Qunoot',
        arabic: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، إِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ',
        transliteration: 'Allahumma-hdini fiman hadayt, wa \'afini fiman \'afayt, wa tawallani fiman tawallayt, wa barik li fima a\'tayt, wa qini sharra ma qadayt, fa-innaka taqdi wa la yuqda \'alayk, innahu la yadhillu man walayt, tabarakta Rabbana wa ta\'alayt',
        translation: 'O Allah, guide me among those You have guided, pardon me among those You have pardoned, turn to me in friendship among those on whom You have turned in friendship, and bless me in what You have bestowed, and save me from the evil of what You have decreed. For verily You decree and none can influence You; and he is not humiliated whom You have befriended. Blessed are You, O Lord, and Exalted',
        when: 'In Witr prayer after Ruku',
        reference: 'Sunan An-Nasa\'i',
        benefits: 'Seeking guidance and protection'
    },

    // ========== LIFE EVENTS ==========
    {
        id: 'parents_1',
        category: 'life_events',
        title: 'For Parents',
        arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
        transliteration: 'Rabbir-hamhuma kama rabbayani saghira',
        translation: 'My Lord, have mercy upon them as they brought me up when I was small',
        when: 'Anytime - praying for parents',
        reference: 'Quran 17:24',
        benefits: 'Fulfilling duty to parents and seeking mercy for them'
    },
    {
        id: 'children_1',
        category: 'life_events',
        title: 'For Righteous Offspring',
        arabic: 'رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ',
        transliteration: 'Rabbi hab li mil-ladunka dhurriyyatan tayyibah, innaka Sami\'ud-du\'a',
        translation: 'My Lord, grant me from Yourself good offspring. Indeed, You are the Hearer of supplication',
        when: 'Praying for children',
        reference: 'Quran 3:38',
        benefits: 'Seeking righteous children from Allah'
    },
    {
        id: 'marriage_1',
        category: 'life_events',
        title: 'For Righteous Spouse',
        arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
        transliteration: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a\'yun waj\'alna lil-muttaqina imama',
        translation: 'Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us a leader for the righteous',
        when: 'For spouse and family',
        reference: 'Quran 25:74',
        benefits: 'Seeking a blessed family life'
    },
    {
        id: 'travel_1',
        category: 'life_events',
        title: 'When Traveling',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
        transliteration: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun',
        translation: 'Glory is to Him Who has subjected this to us, and we could never have it by our efforts. Surely, unto our Lord we are returning',
        when: 'When starting a journey',
        reference: 'Sunan Abu Dawud',
        benefits: 'Safety during travel'
    },
    {
        id: 'sick_person_1',
        category: 'life_events',
        title: 'For the Sick',
        arabic: 'أَذْهِبِ الْبَاسَ، رَبَّ النَّاسِ، وَاشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
        transliteration: 'Adh-hibil-ba\'s, Rabban-nas, washfi Antash-Shafi, la shifa\'a illa shifa\'uka, shifaan la yughadiru saqama',
        translation: 'Remove the harm, Lord of mankind, and heal, You are the Healer. There is no healing except Your healing, a healing that leaves no illness',
        when: 'For someone who is sick',
        reference: 'Sahih Bukhari',
        benefits: 'Seeking healing from Allah'
    },
    {
        id: 'anxiety_1',
        category: 'life_events',
        title: 'For Anxiety and Worry',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
        transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan, wal-\'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala\'id-dayni wa ghalabatir-rijal',
        translation: 'O Allah, I seek refuge in You from worry and grief, from helplessness and laziness, from cowardice and miserliness, and from being overcome by debt and from being overpowered by men',
        when: 'When feeling anxious or worried',
        reference: 'Sahih Bukhari',
        benefits: 'Relief from anxiety and distress'
    },
    {
        id: 'difficulty_1',
        category: 'life_events',
        title: 'In Times of Difficulty',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
        transliteration: 'La ilaha illal-lahul-Adhemul-Halim, la ilaha illal-lahu Rabbul-\'Arshil-Adhim, la ilaha illal-lahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-\'Arshil-Karim',
        translation: 'There is no god but Allah, the Magnificent, the Forbearing. There is no god but Allah, Lord of the Magnificent Throne. There is no god but Allah, Lord of the heavens and Lord of the earth, and Lord of the Noble Throne',
        when: 'During times of distress',
        reference: 'Sahih Bukhari',
        benefits: 'Relief from difficulty'
    },
    {
        id: 'debt_1',
        category: 'life_events',
        title: 'For Relief from Debt',
        arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
        transliteration: 'Allahummak-fini bi-halala ka \'an haramika, wa aghnini bi-fadlika \'amman siwak',
        translation: 'O Allah, make what is lawful enough for me, as opposed to what is unlawful, and spare me by Your grace, of need of others',
        when: 'For relief from debt and financial difficulty',
        reference: 'Sunan At-Tirmidhi',
        benefits: 'Relief from debt and sufficiency'
    },

    // ========== SEEKING FORGIVENESS ==========
    {
        id: 'forgiveness_1',
        category: 'forgiveness',
        title: 'Master of Seeking Forgiveness (Sayyid al-Istighfar)',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        transliteration: 'Allahumma Anta Rabbi la ilaha illa Ant, khalaqtani wa ana \'abduk, wa ana \'ala \'ahdika wa wa\'dika mas-tata\'t, a\'udhu bika min sharri ma sana\'t, abu\'u laka bi ni\'matika \'alayya wa abu\'u bi dhanbi, faghfir li fa-innahu la yaghfirudh-dhunuba illa Ant',
        translation: 'O Allah, You are my Lord, there is no god but You. You created me and I am Your slave. I am keeping my promise and covenant to You as much as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your blessings upon me, and I acknowledge my sins. Forgive me, for none forgives sins but You',
        when: 'Morning and evening, especially morning',
        reference: 'Sahih Bukhari',
        benefits: 'Whoever says it during the day with firm belief and dies that day will enter Paradise'
    },
    {
        id: 'forgiveness_2',
        category: 'forgiveness',
        title: 'Simple Istighfar',
        arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
        transliteration: 'Astaghfirullah wa atubu ilayh',
        translation: 'I seek forgiveness from Allah and repent to Him',
        when: 'Recite frequently throughout the day (100+ times)',
        reference: 'Sahih Bukhari',
        benefits: 'The Prophet (ﷺ) sought forgiveness 70-100 times daily'
    },
    {
        id: 'forgiveness_3',
        category: 'forgiveness',
        title: 'For Major Sins',
        arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
        transliteration: 'La ilaha illa Anta, Subhanaka, inni kuntu minadh-dhalimin',
        translation: 'There is no god but You, Glory is to You. Indeed, I have been among the wrongdoers',
        when: 'When seeking Allah\'s forgiveness and mercy',
        reference: 'Quran 21:87 (Dua of Prophet Yunus)',
        benefits: 'No Muslim makes this dua for anything except Allah responds to him'
    },
    {
        id: 'forgiveness_4',
        category: 'forgiveness',
        title: 'Asking for Forgiveness and Mercy',
        arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَارْزُقْنِي وَعَافِنِي',
        transliteration: 'Rabbigh-fir li warhamni wahdini warzuqni wa \'afini',
        translation: 'My Lord, forgive me, have mercy on me, guide me, provide for me, and give me good health',
        when: 'Between two prostrations in prayer, or anytime',
        reference: 'Sunan Ibn Majah',
        benefits: 'Comprehensive dua covering all needs'
    },
    {
        id: 'repentance_1',
        category: 'forgiveness',
        title: 'After Committing a Sin',
        arabic: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ، وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
        transliteration: 'Allahumma inni dhalamtu nafsi dhulman kathiran, wa la yaghfirudh-dhunuba illa Anta, faghfir li maghfiratan min \'indika, warhamni innaka Antal-Ghafurur-Rahim',
        translation: 'O Allah, I have greatly wronged myself and no one forgives sins but You. So grant me forgiveness from You and have mercy on me. Surely, You are Forgiving, Merciful',
        when: 'After committing a sin',
        reference: 'Sahih Bukhari',
        benefits: 'Seeking Allah\'s forgiveness with humility'
    },

    // ========== PROTECTION & GUIDANCE ==========
    {
        id: 'protection_1',
        category: 'protection',
        title: 'The Last Two Verses of Surah Al-Baqarah',
        arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ',
        transliteration: 'Amanar-Rasulu bima unzila ilayhi mir-Rabbihi wal-mu\'minun. Kullun amana billahi wa mala\'ikatihi wa kutubihi wa Rusulihi la nufarriqu bayna ahadim-mir-Rusulihi wa qalu sami\'na wa ata\'na ghufranaka Rabbana wa ilaykal-masir',
        translation: 'The Messenger believes in what has been revealed to him from his Lord, as do the believers. Each one believes in Allah, His angels, His books, and His messengers. We make no distinction between any of His messengers. And they say: We hear and we obey. Grant us Your forgiveness, our Lord, and to You is the return',
        when: 'Before sleep',
        reference: 'Quran 2:285-286',
        benefits: 'These two verses will suffice you (protection throughout the night)'
    },
    {
        id: 'protection_2',
        category: 'protection',
        title: 'Seeking Refuge from Evil',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: 'A\'udhu bikalimatil-lahit-tammati min sharri ma khalaq',
        translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created',
        when: 'Morning and evening (3 times), when settling somewhere',
        reference: 'Sahih Muslim',
        benefits: 'Protection from all harm'
    },
    {
        id: 'protection_3',
        category: 'protection',
        title: 'Protection from Shaytan',
        arabic: 'أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
        transliteration: 'A\'udhu billahis-Sami\'il-\'Alim minash-Shaytanir-rajim',
        translation: 'I seek refuge in Allah, the All-Hearing, the All-Knowing, from Satan the rejected',
        when: 'When feeling whispers or temptation',
        reference: 'Sunan Abu Dawud',
        benefits: 'Protection from Satan\'s influence'
    },
    {
        id: 'guidance_1',
        category: 'protection',
        title: 'For Guidance',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
        transliteration: 'Allahumma inni as\'alukal-huda wat-tuqa wal-\'afafa wal-ghina',
        translation: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency',
        when: 'Anytime',
        reference: 'Sahih Muslim',
        benefits: 'Seeking essential qualities for a good life'
    },
    {
        id: 'guidance_2',
        category: 'protection',
        title: 'For Knowledge and Understanding',
        arabic: 'رَبِّ زِدْنِي عِلْمًا',
        transliteration: 'Rabbi zidni \'ilma',
        translation: 'My Lord, increase me in knowledge',
        when: 'When seeking knowledge',
        reference: 'Quran 20:114',
        benefits: 'Seeking beneficial knowledge'
    },
    {
        id: 'evil_eye_1',
        category: 'protection',
        title: 'Protection from Evil Eye',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
        transliteration: 'A\'udhu bikalimatil-lahit-tammati min kulli shaytanin wa hammah, wa min kulli \'aynin lammah',
        translation: 'I seek refuge in the perfect words of Allah from every devil and every poisonous pest, and from every harmful envious eye',
        when: 'For protection, especially for children',
        reference: 'Sahih Bukhari',
        benefits: 'Protection from evil eye and harm'
    },

    // ========== SPECIAL OCCASIONS ==========
    {
        id: 'ramadan_1',
        category: 'special',
        title: 'Breaking the Fast (Iftar)',
        arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
        transliteration: 'Allahumma laka sumtu wa \'ala rizqika aftart',
        translation: 'O Allah, for You I have fasted and with Your provision I have broken my fast',
        when: 'When breaking the fast',
        reference: 'Sunan Abu Dawud',
        benefits: 'Acknowledged Allah\'s blessing of fasting and provision'
    },
    {
        id: 'ramadan_2',
        category: 'special',
        title: 'Laylatul Qadr',
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        transliteration: 'Allahumma innaka \'afuwwun tuhibbul-\'afwa fa\'fu \'anni',
        translation: 'O Allah, You are Pardoning and You love to pardon, so pardon me',
        when: 'During Laylatul Qadr (Night of Decree) in Ramadan',
        reference: 'Sunan At-Tirmidhi',
        benefits: 'The best dua for Laylatul Qadr'
    },
    {
        id: 'friday_1',
        category: 'special',
        title: 'Salawat on the Prophet (Friday)',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliteration: 'Allahumma salli \'ala Muhammadin wa \'ala ali Muhammad, kama sallayta \'ala Ibrahima wa \'ala ali Ibrahim, innaka Hamidun Majid',
        translation: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious',
        when: 'Especially on Friday, and anytime',
        reference: 'Sahih Bukhari',
        benefits: 'Sending blessings upon the Prophet brings Allah\'s blessings upon you'
    },
    {
        id: 'eid_1',
        category: 'special',
        title: 'Eid Takbir',
        arabic: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللَّهُ، اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ',
        transliteration: 'Allahu Akbar, Allahu Akbar, la ilaha illallah, Allahu Akbar, Allahu Akbar, wa lillahil-hamd',
        translation: 'Allah is the Greatest, Allah is the Greatest, there is no god but Allah. Allah is the Greatest, Allah is the Greatest, and to Allah belongs all praise',
        when: 'During Eid days',
        reference: 'Various authentic narrations',
        benefits: 'Glorifying Allah during Eid celebrations'
    },
    {
        id: 'entering_masjid_1',
        category: 'special',
        title: 'Entering the Masjid',
        arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        transliteration: 'Allahummaf-tah li abwaba rahmatik',
        translation: 'O Allah, open for me the doors of Your mercy',
        when: 'When entering the masjid',
        reference: 'Sahih Muslim',
        benefits: 'Seeking Allah\'s mercy upon entering His house'
    },
    {
        id: 'leaving_masjid_1',
        category: 'special',
        title: 'Leaving the Masjid',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
        transliteration: 'Allahumma inni as\'aluka min fadlik',
        translation: 'O Allah, I ask You from Your bounty',
        when: 'When leaving the masjid',
        reference: 'Sahih Muslim',
        benefits: 'Seeking Allah\'s favor'
    },
];

/**
 * Get all Dua categories
 * @returns {Array} Array of category objects
 */
export const getDuaCategories = () => {
    return DUA_CATEGORIES;
};

/**
 * Get Duas by category
 * @param {string} categoryId - Category ID
 * @returns {Array} Array of Dua objects
 */
export const getDuasByCategory = (categoryId) => {
    return DUAS.filter(dua => dua.category === categoryId);
};

/**
 * Get a single Dua by ID
 * @param {string} duaId - Dua ID
 * @returns {Object|null} Dua object or null
 */
export const getDuaById = (duaId) => {
    return DUAS.find(dua => dua.id === duaId) || null;
};

/**
 * Search Duas by keyword
 * @param {string} query - Search query
 * @returns {Array} Array of matching Duas
 */
export const searchDuas = (query) => {
    const lowerQuery = query.toLowerCase();
    return DUAS.filter(dua =>
        dua.title.toLowerCase().includes(lowerQuery) ||
        dua.translation.toLowerCase().includes(lowerQuery) ||
        dua.when.toLowerCase().includes(lowerQuery)
    );
};

/**
 * Get all Duas
 * @returns {Array} All Duas
 */
export const getAllDuas = () => {
    return DUAS;
};
