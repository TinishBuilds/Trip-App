import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AvatarStack, IconButton, Pill, PrimaryButton, Screen, SectionHeader, Stat } from '@/components/roam-ui';
import { places } from '@/data/mock';
import { useI18n } from '@/i18n';
import { shareTrip } from '@/services/share';
import { useAppStore } from '@/store/app-store';
import { colors, radius, shadow, spacing } from '@/theme';

const voteOptions = [
  { id: 'must', icon: 'heart' },
  { id: 'interested', icon: 'sparkles' },
  { id: 'skip', icon: 'remove-circle-outline' },
] as const;

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, placeVotes, setPlaceVote, useCheaperPicks: applyCheaperPicks } = useAppStore();
  const { language, localize, t } = useI18n();
  const trip = trips.find((item) => item.id === id) ?? trips[0];
  const budgetRatio = trip.budget ? Math.min(trip.spent / trip.budget, 1) : 0;

  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.navigation}>
        <IconButton icon="arrow-back" accessibilityLabel="Back" onPress={() => router.back()} />
        <Text style={styles.navigationTitle}>{t('tripBoard')}</Text>
        <IconButton icon="share-outline" accessibilityLabel={t('share')} onPress={() => shareTrip(trip, language === 'ja')} />
      </View>

      <View style={styles.heroCard}>
        <Image source={{ uri: trip.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient colors={['rgba(17,24,47,0.02)', 'rgba(17,24,47,0.92)']} style={StyleSheet.absoluteFill} />
        <View style={styles.heroTop}><Pill label={trip.kind === 'small' ? t('smallTrip') : localize(trip.date, trip.dateJa)} icon="calendar-outline" tone="dark" /></View>
        <View style={styles.heroBottom}>
          <Text style={styles.heroTitle}>{localize(trip.title, trip.titleJa)}</Text>
          <Text style={styles.heroMeta}>{localize(trip.location, trip.locationJa)} · {localize(trip.duration, trip.durationJa)}</Text>
          <AvatarStack count={trip.crew} dark />
        </View>
      </View>

      <View style={styles.stats}>
        <Stat icon="footsteps-outline" value={trip.distance} label={localize('distance', '移動距離')} />
        <Stat icon="people-outline" value={`${trip.crew}`} label={t('friends')} />
        <Stat icon="ribbon-outline" value={`${trip.badgeCount}`} label={t('badges')} />
      </View>

      <SectionHeader title={t('places')} subtitle={localize('Vote with friends and build one shared shortlist.', 'みんなで投票して、行きたい場所をひとつに。')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.placeList}>
        {places.map((place) => (
          <View key={place.id} style={styles.placeCard}>
            <Image source={{ uri: place.image }} style={styles.placeImage} contentFit="cover" />
            <View style={styles.placeCopy}>
              <Text numberOfLines={1} style={styles.placeName}>{localize(place.name, place.nameJa)}</Text>
              <Text style={styles.placeMeta}>{localize(place.area, place.areaJa)} · {place.price ? `¥${place.price.toLocaleString()}` : localize('Free', '無料')}</Text>
              <View style={styles.votes}><Ionicons name="people" color={colors.indigo} size={14} /><Text style={styles.voteCount}>{place.votes} {t('groupVotes')}</Text></View>
              <View style={styles.voteRow}>
                {voteOptions.map((option) => {
                  const active = placeVotes[place.id] === option.id;
                  return <Pressable key={option.id} onPress={() => setPlaceVote(place.id, option.id)} style={[styles.voteButton, active && styles.voteButtonActive]}><Ionicons name={option.icon} size={17} color={active ? colors.white : colors.muted} /></Pressable>;
                })}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <SectionHeader title={t('itinerary')} subtitle={localize('A flexible plan that your whole crew can follow.', '全員がわかる、ゆとりのある旅程。')} />
      <View style={styles.timeline}>
        {[
          ['10:00', 'Meiji Jingu & forest walk', '明治神宮と森の散歩', 'leaf-outline'],
          ['12:30', 'Lunch around Shibuya', '渋谷でランチ', 'restaurant-outline'],
          ['15:00', 'Shibuya Sky', '渋谷スカイ', 'sunny-outline'],
          ['18:30', 'Golden hour photo walk', '夕暮れフォトウォーク', 'camera-outline'],
        ].map(([time, en, ja, icon], index) => (
          <View key={time} style={styles.timelineRow}>
            <View style={styles.timelineTrack}>
              <View style={styles.timelineDot}><Ionicons name={icon as React.ComponentProps<typeof Ionicons>['name']} size={17} color={colors.indigo} /></View>
              {index < 3 ? <View style={styles.timelineLine} /> : null}
            </View>
            <View style={styles.timelineCopy}><Text style={styles.timelineTime}>{time}</Text><Text style={styles.timelineTitle}>{localize(en, ja)}</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View><Text style={styles.budgetLabel}>{t('budget')}</Text><Text style={styles.budgetValue}>¥{trip.spent.toLocaleString()} <Text style={styles.budgetOf}>/ ¥{trip.budget.toLocaleString()}</Text></Text></View>
          <Pill label={`¥${Math.max(0, trip.budget - trip.spent).toLocaleString()} ${t('budgetLeft')}`} tone="mint" icon="wallet-outline" />
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.round(budgetRatio * 100)}%` }]} /></View>
        <View style={styles.budgetBreakdown}>
          <Text style={styles.breakdownText}>🍜 {localize('Food', '食事')} ¥12,400</Text>
          <Text style={styles.breakdownText}>🎟️ {localize('Activities', '体験')} ¥8,300</Text>
          <Text style={styles.breakdownText}>🚇 {localize('Transit', '交通')} ¥4,950</Text>
        </View>
        <PrimaryButton label={t('cheaper')} icon="sparkles-outline" variant="light" onPress={() => applyCheaperPicks(trip.id)} />
      </View>

      <View style={styles.bottomActions}>
        <PrimaryButton style={styles.flex} label={t('mapRoute')} icon="navigate-outline" onPress={() => router.push({ pathname: '/map/[id]', params: { id: trip.id } })} />
        <PrimaryButton style={styles.flex} label={t('recap')} icon="images-outline" variant="coral" onPress={() => router.push({ pathname: '/recap/[id]', params: { id: trip.id } })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: spacing.sm },
  navigation: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navigationTitle: { color: colors.ink, fontWeight: '900', fontSize: 17 },
  heroCard: { height: 390, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'space-between', padding: spacing.md, ...shadow },
  heroTop: { flexDirection: 'row' },
  heroBottom: { gap: spacing.sm },
  heroTitle: { color: colors.white, fontSize: 33, lineHeight: 36, fontWeight: '900', letterSpacing: -1.2 },
  heroMeta: { color: 'rgba(255,255,255,0.82)', fontSize: 14, fontWeight: '700' },
  stats: { flexDirection: 'row', gap: spacing.sm },
  placeList: { paddingRight: spacing.lg },
  placeCard: { width: 224, marginRight: spacing.md, backgroundColor: colors.white, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  placeImage: { width: '100%', height: 135 },
  placeCopy: { padding: spacing.sm, gap: 5 },
  placeName: { color: colors.ink, fontWeight: '900', fontSize: 16 },
  placeMeta: { color: colors.muted, fontSize: 12 },
  votes: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  voteCount: { color: colors.indigo, fontWeight: '800', fontSize: 11 },
  voteRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  voteButton: { flex: 1, height: 34, borderRadius: radius.sm, backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  voteButtonActive: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  timeline: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line },
  timelineRow: { minHeight: 70, flexDirection: 'row', gap: spacing.md },
  timelineTrack: { width: 38, alignItems: 'center' },
  timelineDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.indigoSoft, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  timelineLine: { width: 2, flex: 1, backgroundColor: colors.indigoSoft },
  timelineCopy: { flex: 1, paddingTop: 4 },
  timelineTime: { color: colors.coral, fontWeight: '900', fontSize: 11, letterSpacing: 0.7 },
  timelineTitle: { color: colors.ink, fontWeight: '800', fontSize: 15, marginTop: 3 },
  budgetCard: { padding: spacing.lg, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, gap: spacing.md },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  budgetLabel: { color: colors.muted, textTransform: 'uppercase', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  budgetValue: { color: colors.ink, fontSize: 25, fontWeight: '900', marginTop: 4 },
  budgetOf: { color: colors.muted, fontSize: 14 },
  progressTrack: { height: 12, borderRadius: 6, backgroundColor: colors.indigoSoft, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6, backgroundColor: colors.green },
  budgetBreakdown: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  breakdownText: { color: colors.muted, fontWeight: '700', fontSize: 11 },
  bottomActions: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
});
