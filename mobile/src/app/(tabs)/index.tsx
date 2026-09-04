import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconButton, Pill, PrimaryButton, Screen, SectionHeader, TopBar, TripCard } from '@/components/roam-ui';
import { badges } from '@/data/mock';
import { useI18n } from '@/i18n';
import { shareTrip } from '@/services/share';
import { useAppStore } from '@/store/app-store';
import { colors, radius, spacing } from '@/theme';

export default function HomeScreen() {
  const { trips } = useAppStore();
  const { language, localize, t } = useI18n();
  const upcoming = trips.find((trip) => !trip.completed) ?? trips[0];
  const smallTrips = trips.filter((trip) => trip.kind === 'small');

  return (
    <Screen>
      <TopBar right={<IconButton icon="add" accessibilityLabel={t('logTrip')} onPress={() => router.push('/create')} />} />
      <View style={styles.greeting}>
        <Text style={styles.eyebrow}>{t('upcoming')}</Text>
        <Text style={styles.hero}>{t('greeting')}</Text>
      </View>

      <TripCard trip={upcoming} onPress={() => router.push({ pathname: '/trip/[id]', params: { id: upcoming.id } })} onShare={() => shareTrip(upcoming, language === 'ja')} />
      <View style={styles.actionRow}>
        <PrimaryButton style={styles.action} label={t('openTrip')} icon="arrow-forward" onPress={() => router.push({ pathname: '/trip/[id]', params: { id: upcoming.id } })} />
        <PrimaryButton style={styles.shareButton} label={t('share')} icon="share-outline" variant="light" onPress={() => shareTrip(upcoming, language === 'ja')} />
      </View>

      <SectionHeader title={t('smallAdventures')} subtitle={t('smallSubtitle')} action={t('seeAll')} onAction={() => router.push('/trips')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontal}>
        {smallTrips.map((trip) => <TripCard compact key={trip.id} trip={trip} onPress={() => router.push({ pathname: '/trip/[id]', params: { id: trip.id } })} onShare={() => shareTrip(trip, language === 'ja')} />)}
        <View style={styles.logCard}>
          <View style={styles.addCircle}><Ionicons name="add" color={colors.white} size={26} /></View>
          <Text style={styles.logTitle}>{t('logTrip')}</Text>
          <Text style={styles.logCopy}>{localize('Even one free afternoon can become a memory.', '空いた午後だって、思い出になる。')}</Text>
          <PrimaryButton label={t('smallTrip')} icon="sunny-outline" onPress={() => router.push('/create?kind=small')} />
        </View>
      </ScrollView>

      <SectionHeader title={t('badges')} subtitle={localize('Tiny wins add up.', '小さな達成を、ひとつずつ。')} />
      <View style={styles.badgeRow}>
        {badges.filter((badge) => badge.unlocked).slice(0, 3).map((badge, index) => (
          <View key={badge.id} style={styles.badgeCard}>
            <View style={[styles.badgeIcon, { backgroundColor: [colors.coralSoft, colors.mint, colors.indigoSoft][index] }]}>
              <Ionicons name={badge.icon as React.ComponentProps<typeof Ionicons>['name']} size={25} color={[colors.coral, colors.green, colors.indigo][index]} />
            </View>
            <Text numberOfLines={2} style={styles.badgeTitle}>{localize(badge.title, badge.titleJa)}</Text>
            <Pill label={t('unlocked')} tone="mint" icon="checkmark" />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { gap: 5 },
  eyebrow: { color: colors.coral, fontSize: 11, fontWeight: '900', letterSpacing: 1.3 },
  hero: { color: colors.ink, fontSize: 35, lineHeight: 39, fontWeight: '900', letterSpacing: -1.5, maxWidth: 330 },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  action: { flex: 1 },
  shareButton: { width: 118 },
  horizontal: { paddingRight: spacing.lg },
  logCard: { width: 276, minHeight: 340, padding: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.indigoSoft, justifyContent: 'center', gap: spacing.md },
  addCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.coral, justifyContent: 'center', alignItems: 'center' },
  logTitle: { color: colors.ink, fontSize: 25, fontWeight: '900' },
  logCopy: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm },
  badgeCard: { flex: 1, minHeight: 154, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, gap: spacing.sm },
  badgeIcon: { width: 46, height: 46, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  badgeTitle: { color: colors.ink, fontWeight: '900', fontSize: 13, minHeight: 34 },
});
