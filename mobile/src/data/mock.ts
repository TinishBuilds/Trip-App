export type TripKind = 'full' | 'small';

export type Trip = {
  id: string;
  kind: TripKind;
  title: string;
  titleJa: string;
  location: string;
  locationJa: string;
  date: string;
  dateJa: string;
  duration: string;
  durationJa: string;
  crew: number;
  distance: string;
  budget: number;
  spent: number;
  image: string;
  cheers: number;
  badgeCount: number;
  completed?: boolean;
};

export const initialTrips: Trip[] = [
  {
    id: 'tokyo-gang', kind: 'full', title: 'Tokyo, with the gang', titleJa: 'みんなで東京旅',
    location: 'Tokyo', locationJa: '東京', date: 'May 23–25', dateJa: '5月23日〜25日',
    duration: '3 days', durationJa: '3日間', crew: 4, distance: '31.8 km', budget: 40000, spent: 32150,
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=85',
    cheers: 24, badgeCount: 3,
  },
  {
    id: 'kissaten-walk', kind: 'small', title: 'The perfect kissaten walk', titleJa: '純喫茶を探す散歩',
    location: 'Shimokitazawa', locationJa: '下北沢', date: 'Last Sunday', dateJa: '先週の日曜日',
    duration: '1h 42m', durationJa: '1時間42分', crew: 2, distance: '6.3 km', budget: 3000, spent: 2100,
    image: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1000&q=85',
    cheers: 12, badgeCount: 3, completed: true,
  },
  {
    id: 'asakusa-sweets', kind: 'small', title: 'Three sweet stops in Asakusa', titleJa: '浅草スイーツ三軒めぐり',
    location: 'Asakusa', locationJa: '浅草', date: 'April 19', dateJa: '4月19日',
    duration: '3 hours', durationJa: '3時間', crew: 3, distance: '2.1 km', budget: 2500, spent: 1860,
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1000&q=85',
    cheers: 8, badgeCount: 2, completed: true,
  },
];

export const places = [
  { id: 'meiji', name: 'Meiji Jingu', nameJa: '明治神宮', area: 'Harajuku', areaJa: '原宿', price: 0, votes: 4, latitude: 35.6764, longitude: 139.6993, image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=700&q=85' },
  { id: 'shibuya', name: 'Shibuya Sky', nameJa: '渋谷スカイ', area: 'Shibuya', areaJa: '渋谷', price: 2500, votes: 4, latitude: 35.6584, longitude: 139.7022, image: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&w=700&q=85' },
  { id: 'tsukiji', name: 'Tsukiji Outer Market', nameJa: '築地場外市場', area: 'Tsukiji', areaJa: '築地', price: 1800, votes: 3, latitude: 35.6654, longitude: 139.7707, image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=700&q=85' },
  { id: 'teamlab', name: 'teamLab Planets', nameJa: 'チームラボプラネッツ', area: 'Toyosu', areaJa: '豊洲', price: 3800, votes: 4, latitude: 35.6492, longitude: 139.7897, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=85' },
];

export const badges = [
  { id: 'food', icon: 'restaurant-outline', title: 'Food first', titleJa: '食いしん坊', detail: 'Save five food stops', detailJa: 'グルメスポットを5件保存', unlocked: true },
  { id: 'together', icon: 'people-outline', title: 'Go together', titleJa: 'みんなで行こう', detail: 'Plan with three friends', detailJa: '友達3人と旅を計画', unlocked: true },
  { id: 'small', icon: 'sunny-outline', title: 'Small but mighty', titleJa: '小さな大冒険', detail: 'Log a trip under 4 hours', detailJa: '4時間以内の旅を記録', unlocked: true },
  { id: 'budget', icon: 'wallet-outline', title: 'Budget smart', titleJa: '予算上手', detail: 'Finish under budget', detailJa: '予算内で旅を完了', unlocked: true },
  { id: 'weekend', icon: 'sparkles-outline', title: 'Weekend wanderer', titleJa: '週末トラベラー', detail: 'Complete three escapes', detailJa: '小旅行を3回完了', unlocked: false },
  { id: 'route', icon: 'map-outline', title: 'Route master', titleJa: 'ルートマスター', detail: 'A friend copies your route', detailJa: '友達がルートをコピー', unlocked: false },
];

export const feed = [
  { id: 'f1', person: 'Hana', personJa: 'ハナ', avatar: 'H', time: '2h', timeJa: '2時間前', title: 'Ramen and rain in Koenji', titleJa: '雨の日の高円寺ラーメン旅', detail: '2h 18m · 4.8 km · ¥1,450', image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=1000&q=85', cheers: 34, comments: 6, badge: 'Rain or shine', badgeJa: '雨でもおでかけ' },
  { id: 'f2', person: 'Jay', personJa: 'ジェイ', avatar: 'J', time: 'Yesterday', timeJa: '昨日', title: 'Quiet morning in Kamakura', titleJa: '鎌倉の静かな朝', detail: 'Half day · 11.2 km · ¥3,900', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1000&q=85', cheers: 52, comments: 9, badge: 'Early bird', badgeJa: '朝活マスター' },
];

export const opportunities = [
  { id: 'o1', title: 'Weekend route tester', titleJa: '週末ルート体験モニター', area: 'Kawagoe', areaJa: '川越', perk: '¥1,000 credit', perkJa: '¥1,000クレジット', image: 'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=900&q=85' },
  { id: 'o2', title: 'Rural school culture day', titleJa: '里山スクール交流デー', area: 'Nagano', areaJa: '長野', perk: 'Verified host', perkJa: '認証済みホスト', image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=85' },
];
