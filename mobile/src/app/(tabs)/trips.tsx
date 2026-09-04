import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconButton, PrimaryButton, Screen, TopBar, TripCard } from '@/components/roam-ui';
import { useI18n } from '@/i18n';
import { shareTrip } from '@/services/share';
import { useAppStore } from '@/store/app-store';
import { colors, radius, spacing } from '@/theme';

type Filter = 'all' | 'planned' | 'completed';

export default function TripsScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const { trips } = useAppStore();
  const { language, localize, t } = useI18n();
  const visible = useMemo(() => trips.filter((trip) => filter === 'all' || (filter === 'completed' ? trip.completed : !trip.completed)), [filter, trips]);

  return (
    <Screen>
      <TopBar title={t('yourTrips')} right={<IconButton icon="add" accessibilityLabel={t('logTrip')} onPress={() => router.push('/create')} />} />
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.title}>{t('yourTrips')}</Text>
          <Text style={styles.subtitle}>{localize(`${trips.length} adventures and counting`, `${trips.length}個の冒険、まだまだ続く`)}</Text>
        </View>
      </View>
      <View style={styles.filters}>
        {(['all', 'planned', 'completed'] as Filter[]).map((item) => (
          <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}>
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{t(item)}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.list}>
        {visible.map((trip) => (
          <TripCard key={trip.id} trip={trip} onPress={() => router.push({ pathname: '/trip/[id]', params: { id: trip.id } })} onShare={() => shareTrip(trip, language === 'ja')} />
        ))}
      </View>
      <PrimaryButton label={t('logTrip')} icon="add" onPress={() => router.push('/create')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  title: { color: colors.ink, fontSize: 35, fontWeight: '900', letterSpacing: -1.4 },
  subtitle: { color: colors.muted, marginTop: 4 },
  filters: { padding: 4, borderRadius: radius.pill, backgroundColor: colors.indigoSoft, flexDirection: 'row' },
  filter: { flex: 1, height: 38, borderRadius: radius.pill, justifyContent: 'center', alignItems: 'center' },
  filterActive: { backgroundColor: colors.white },
  filterText: { color: colors.muted, fontWeight: '800', fontSize: 13 },
  filterTextActive: { color: colors.indigo },
  list: { gap: spacing.lg },
});
