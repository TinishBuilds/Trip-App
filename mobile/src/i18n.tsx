import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'ja';

const copy = {
  en: {
    home: 'Home', trips: 'Trips', discover: 'Discover', profile: 'You', greeting: 'Ready for a little adventure?',
    upcoming: 'UPCOMING TRIP', openTrip: 'Open trip', share: 'Share', smallAdventures: 'Small adventures',
    smallSubtitle: 'A great day out still counts.', seeAll: 'See all', logTrip: 'Log a trip',
    discoverTitle: 'See where your people went.', discoverSubtitle: 'Real routes, tiny escapes, and trips worth copying.',
    cheers: 'cheers', comments: 'comments', saveRoute: 'Save route', planTogether: 'Plan together',
    yourTrips: 'Your trips', planned: 'Planned', completed: 'Completed', all: 'All',
    badges: 'Badges', settings: 'Settings', language: 'Language', english: 'English', japanese: '日本語',
    pro: 'RoamTogether Pro', managePlan: 'Manage plan', unlockPro: 'Unlock Pro',
    tripBoard: 'Trip board', places: 'Places', itinerary: 'Itinerary', budget: 'Budget',
    mustVisit: 'Must visit', interested: 'Interested', skip: 'Skip', groupVotes: 'group votes',
    mapRoute: 'Open live route', recap: 'Create recap', budgetLeft: 'left in the plan', cheaper: 'Use cheaper picks',
    day: 'Day', morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening',
    createTitle: 'What kind of adventure?', smallTrip: 'Small trip', fullTrip: 'Multi-day trip',
    titleLabel: 'Name your adventure', destination: 'Where?', duration: 'How long?', crew: 'Who is coming?',
    saveAdventure: 'Save adventure', cancel: 'Cancel', yourRecap: 'Your trip recap', postReady: 'READY TO SHARE',
    shareRecap: 'Share recap', copyLink: 'Copy public link', daysOut: 'days out', stops: 'stops', friends: 'friends',
    unlocked: 'unlocked', localPicks: 'Local picks', matches: 'Matches your plans', join: 'View invitation',
  },
  ja: {
    home: 'ホーム', trips: '旅', discover: '発見', profile: 'マイページ', greeting: '今日は、どんな小さな冒険へ？',
    upcoming: '次の旅行', openTrip: '旅を開く', share: 'シェア', smallAdventures: '小さな冒険',
    smallSubtitle: 'いつもの一日も、立派な旅。', seeAll: 'すべて見る', logTrip: '旅を記録',
    discoverTitle: 'みんなの旅から見つけよう。', discoverSubtitle: 'リアルなルート、小さなおでかけ、真似したくなる旅。',
    cheers: 'いいね', comments: 'コメント', saveRoute: 'ルートを保存', planTogether: '一緒に計画',
    yourTrips: 'あなたの旅', planned: '計画中', completed: '完了', all: 'すべて',
    badges: 'バッジ', settings: '設定', language: '言語', english: 'English', japanese: '日本語',
    pro: 'RoamTogether Pro', managePlan: 'プラン管理', unlockPro: 'Proをはじめる',
    tripBoard: '旅のボード', places: 'スポット', itinerary: '旅程', budget: '予算',
    mustVisit: '絶対行きたい', interested: '気になる', skip: '今回は見送る', groupVotes: 'グループ投票',
    mapRoute: 'ライブマップを開く', recap: '旅のまとめを作る', budgetLeft: '残り予算', cheaper: 'お得プランに切替',
    day: '日目', morning: '朝', afternoon: '午後', evening: '夜',
    createTitle: 'どんな冒険にする？', smallTrip: '小さな旅', fullTrip: '複数日の旅',
    titleLabel: '旅の名前', destination: 'どこへ？', duration: 'どのくらい？', crew: '誰と行く？',
    saveAdventure: '冒険を保存', cancel: 'キャンセル', yourRecap: '旅のまとめ', postReady: 'シェアする準備OK',
    shareRecap: 'まとめをシェア', copyLink: '公開リンクをコピー', daysOut: '日間', stops: 'スポット', friends: '仲間',
    unlocked: '獲得済み', localPicks: '地域のおすすめ', matches: 'あなたの旅にマッチ', join: '詳細を見る',
  },
} as const;

export type CopyKey = keyof typeof copy.en;
type I18nValue = { language: Language; setLanguage: (language: Language) => void; t: (key: CopyKey) => string; localize: (en: string, ja: string) => string };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: PropsWithChildren) {
  const deviceLanguage: Language = getLocales()[0]?.languageCode === 'ja' ? 'ja' : 'en';
  const [language, setLanguageState] = useState<Language>(deviceLanguage);

  useEffect(() => { AsyncStorage.getItem('rt-language').then((saved) => { if (saved === 'en' || saved === 'ja') setLanguageState(saved); }); }, []);
  const setLanguage = (next: Language) => { setLanguageState(next); AsyncStorage.setItem('rt-language', next).catch(() => undefined); };
  const value = useMemo(() => ({ language, setLanguage, t: (key: CopyKey) => copy[language][key], localize: (en: string, ja: string) => language === 'ja' ? ja : en }), [language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used within I18nProvider');
  return value;
}
