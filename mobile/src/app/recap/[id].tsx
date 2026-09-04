import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { IconButton, Pill, PrimaryButton, Screen } from '@/components/roam-ui';
import { badges, places } from '@/data/mock';
import { useI18n } from '@/i18n';
import { copyTripLink, shareTrip } from '@/services/share';
import { useAppStore } from '@/store/app-store';
import { colors, radius, shadow, spacing } from '@/theme';

export default function RecapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips } = useAppStore();
  const { language, localize, t } = useI18n();
  const trip = trips.find((item) => item.id === id) ?? trips[0];
  const cardRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);

  const shareCard = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const available = await Sharing.isAvailableAsync();
      if (!available) return await shareTrip(trip, language === 'ja');
      const uri = await captureRef(cardRef, { format: 'png', quality: 0.95, result: 'tmpfile' });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t('shareRecap') });
    } catch {
      Alert.alert(localize('Could not share', 'シェアできませんでした'), localize('Please try again in a moment.', '少し待ってからもう一度お試しください。'));
    } finally {
      setSharing(false);
    }
  };

  const copy = async () => {
    await copyTripLink(trip.id);
    Alert.alert(localize('Link copied', 'リンクをコピーしました'), localize('Your public trip link is ready to paste.', '公開リンクを貼り付けられます。'));
  };

  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.navigation}>
        <IconButton icon="arrow-back" accessibilityLabel="Back" onPress={() => router.back()} />
        <Text style={styles.navigationTitle}>{t('yourRecap')}</Text>
        <Pill label={t('postReady')} tone="mint" icon="checkmark" />
      </View>

      <View ref={cardRef} collapsable={false} style={styles.recapCard}>
        <View style={styles.photo}>
          <Image source={{ uri: trip.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={['rgba(17,24,47,0.02)', 'rgba(17,24,47,0.94)']} style={StyleSheet.absoluteFill} />
          <View style={styles.photoBrand}><View style={styles.brandMark}><Ionicons name="navigate" size={16} color={colors.white} /></View><Text style={styles.brand}>RoamTogether</Text></View>
          <View style={styles.photoCopy}>
            <Pill label={trip.kind === 'small' ? t('smallTrip') : localize(trip.date, trip.dateJa)} tone="coral" icon="sparkles" />
            <Text style={styles.recapTitle}>{localize(trip.title, trip.titleJa)}</Text>
            <Text style={styles.recapMeta}>{localize(trip.location, trip.locationJa)} · {localize(trip.duration, trip.durationJa)}</Text>
          </View>
        </View>
        <View style={styles.recapBody}>
          <View style={styles.routeGraphic}>
            {places.map((place, index) => (
              <React.Fragment key={place.id}>
                <View style={styles.routeStop}><Text style={styles.routeNumber}>{index + 1}</Text></View>
                {index < places.length - 1 ? <View style={styles.routeLine} /> : null}
              </React.Fragment>
            ))}
          </View>
          <View style={styles.recapStats}>
            <RecapStat value={trip.distance} label={localize('DISTANCE', '距離')} />
            <RecapStat value={localize(trip.duration, trip.durationJa)} label={localize('TIME OUT', '時間')} />
            <RecapStat value={`${places.length}`} label={t('stops').toUpperCase()} />
          </View>
          <View style={styles.earned}>
            <Text style={styles.earnedLabel}>{localize('BADGES EARNED', '獲得したバッジ')}</Text>
            <View style={styles.earnedBadges}>
              {badges.filter((badge) => badge.unlocked).slice(0, 3).map((badge, index) => (
                <View key={badge.id} style={[styles.earnedBadge, { backgroundColor: [colors.coralSoft, colors.mint, colors.indigoSoft][index] }]}>
                  <Ionicons name={badge.icon as React.ComponentProps<typeof Ionicons>['name']} size={19} color={[colors.coral, colors.green, colors.indigo][index]} />
                  <Text style={styles.earnedText}>{localize(badge.title, badge.titleJa)}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.tagline}>{localize('A little adventure is still an adventure.', '小さなおでかけも、立派な冒険。')}</Text>
        </View>
      </View>

      <PrimaryButton disabled={sharing} label={sharing ? localize('Preparing…', '準備中…') : t('shareRecap')} icon="share-social-outline" variant="coral" onPress={shareCard} />
      <PrimaryButton label={t('copyLink')} icon="link-outline" variant="light" onPress={copy} />
    </Screen>
  );
}

function RecapStat({ value, label }: { value: string; label: string }) {
  return <View style={styles.recapStat}><Text numberOfLines={1} style={styles.recapStatValue}>{value}</Text><Text style={styles.recapStatLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { paddingTop: spacing.sm },
  navigation: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  navigationTitle: { color: colors.ink, fontWeight: '900', fontSize: 17 },
  recapCard: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden', ...shadow },
  photo: { height: 390, padding: spacing.lg, justifyContent: 'space-between' },
  photoBrand: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  brandMark: { width: 30, height: 30, borderRadius: 11, backgroundColor: colors.indigo, justifyContent: 'center', alignItems: 'center' },
  brand: { color: colors.white, fontWeight: '900', fontSize: 16 },
  photoCopy: { gap: spacing.sm },
  recapTitle: { color: colors.white, fontWeight: '900', fontSize: 36, lineHeight: 39, letterSpacing: -1.4 },
  recapMeta: { color: 'rgba(255,255,255,0.78)', fontWeight: '700' },
  recapBody: { padding: spacing.lg, gap: spacing.lg },
  routeGraphic: { height: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm },
  routeStop: { width: 31, height: 31, borderRadius: 16, backgroundColor: colors.coral, justifyContent: 'center', alignItems: 'center' },
  routeNumber: { color: colors.white, fontWeight: '900', fontSize: 11 },
  routeLine: { flex: 1, height: 3, backgroundColor: colors.indigoSoft },
  recapStats: { flexDirection: 'row', paddingVertical: spacing.md, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  recapStat: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  recapStatValue: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  recapStatLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 0.7, marginTop: 4 },
  earned: { gap: spacing.sm },
  earnedLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  earnedBadges: { flexDirection: 'row', gap: 6 },
  earnedBadge: { flex: 1, minHeight: 70, borderRadius: radius.sm, padding: 8, justifyContent: 'center', gap: 5 },
  earnedText: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  tagline: { color: colors.indigo, textAlign: 'center', fontWeight: '900', fontSize: 14 },
});
