import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { IconButton, Pill, PrimaryButton, Screen, SectionHeader, TopBar } from '@/components/roam-ui';
import { feed, opportunities } from '@/data/mock';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/app-store';
import { colors, radius, shadow, spacing } from '@/theme';

export default function DiscoverScreen() {
  const { cheered, savedRoutes, toggleCheer, toggleSavedRoute } = useAppStore();
  const { language, localize, t } = useI18n();

  return (
    <Screen>
      <TopBar title={t('discover')} right={<IconButton icon="search" accessibilityLabel="Search" />} />
      <View style={styles.intro}>
        <Text style={styles.title}>{t('discoverTitle')}</Text>
        <Text style={styles.subtitle}>{t('discoverSubtitle')}</Text>
      </View>

      {feed.map((item) => {
        const liked = cheered.includes(item.id);
        const saved = savedRoutes.includes(item.id);
        return (
          <View key={item.id} style={styles.feedCard}>
            <View style={styles.personRow}>
              <View style={styles.personAvatar}><Text style={styles.personAvatarText}>{item.avatar}</Text></View>
              <View style={styles.personCopy}>
                <Text style={styles.person}>{localize(item.person, item.personJa)}</Text>
                <Text style={styles.time}>{localize(item.time, item.timeJa)}</Text>
              </View>
              <IconButton icon="ellipsis-horizontal" accessibilityLabel="More" />
            </View>
            <View style={styles.feedImage}>
              <Image source={{ uri: item.image }} contentFit="cover" style={StyleSheet.absoluteFill} />
              <LinearGradient colors={['transparent', 'rgba(17,24,47,0.88)']} style={StyleSheet.absoluteFill} />
              <View style={styles.feedOverlay}>
                <Pill label={localize(item.badge, item.badgeJa)} tone="coral" icon="ribbon-outline" />
                <Text style={styles.feedTitle}>{localize(item.title, item.titleJa)}</Text>
                <Text style={styles.feedDetail}>{item.detail}</Text>
              </View>
            </View>
            <View style={styles.socialRow}>
              <Pressable onPress={() => toggleCheer(item.id)} style={styles.socialButton}>
                <Ionicons name={liked ? 'heart' : 'heart-outline'} color={liked ? colors.coral : colors.ink} size={21} />
                <Text style={[styles.socialText, liked && { color: colors.coral }]}>{item.cheers + (liked ? 1 : 0)} {t('cheers')}</Text>
              </Pressable>
              <View style={styles.socialButton}><Ionicons name="chatbubble-outline" color={colors.ink} size={19} /><Text style={styles.socialText}>{item.comments}</Text></View>
              <Pressable onPress={() => Share.share({ message: `${localize(item.title, item.titleJa)}\nhttps://roamtogether.app/discover/${item.id}` })} style={[styles.socialButton, { marginLeft: 'auto' }]}>
                <Ionicons name="share-outline" color={colors.ink} size={20} />
              </Pressable>
            </View>
            <PrimaryButton
              label={saved ? localize('Route saved', '保存済み') : t('saveRoute')}
              icon={saved ? 'checkmark-circle' : 'bookmark-outline'}
              variant={saved ? 'light' : 'primary'}
              onPress={() => toggleSavedRoute(item.id)}
            />
          </View>
        );
      })}

      <SectionHeader title={t('localPicks')} subtitle={t('matches')} />
      <View style={styles.opportunities}>
        {opportunities.map((item) => (
          <View key={item.id} style={styles.opportunity}>
            <Image source={{ uri: item.image }} style={styles.opportunityImage} contentFit="cover" />
            <View style={styles.opportunityCopy}>
              <Pill label={localize(item.area, item.areaJa)} icon="location-outline" tone="mint" />
              <Text style={styles.opportunityTitle}>{localize(item.title, item.titleJa)}</Text>
              <Text style={styles.opportunityPerk}>{localize(item.perk, item.perkJa)}</Text>
              <Pressable onPress={() => Alert.alert(localize('Invitation saved', '招待を保存しました'), localize('We will notify you when applications open.', '募集が始まったらお知らせします。'))}>
                <Text style={styles.invite}>{t('join')} →</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  title: { color: colors.ink, fontSize: 35, lineHeight: 39, fontWeight: '900', letterSpacing: -1.5 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, maxWidth: 340 },
  feedCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, gap: spacing.md, borderWidth: 1, borderColor: colors.line, ...shadow },
  personRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  personAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.coralSoft, justifyContent: 'center', alignItems: 'center' },
  personAvatarText: { color: colors.coral, fontWeight: '900', fontSize: 16 },
  personCopy: { flex: 1 },
  person: { color: colors.ink, fontWeight: '900', fontSize: 15 },
  time: { color: colors.muted, fontSize: 12, marginTop: 2 },
  feedImage: { height: 330, borderRadius: radius.md, overflow: 'hidden', justifyContent: 'flex-end' },
  feedOverlay: { padding: spacing.lg, gap: spacing.sm, justifyContent: 'flex-end', flex: 1 },
  feedTitle: { color: colors.white, fontWeight: '900', fontSize: 25, lineHeight: 28, letterSpacing: -0.8 },
  feedDetail: { color: 'rgba(255,255,255,0.82)', fontWeight: '700', fontSize: 13 },
  socialRow: { flexDirection: 'row', alignItems: 'center', minHeight: 28, gap: spacing.md },
  socialButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  socialText: { color: colors.ink, fontWeight: '800', fontSize: 13 },
  opportunities: { gap: spacing.md },
  opportunity: { flexDirection: 'row', gap: spacing.md, padding: spacing.sm, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  opportunityImage: { width: 105, minHeight: 150, borderRadius: radius.sm },
  opportunityCopy: { flex: 1, paddingVertical: 4, gap: 8 },
  opportunityTitle: { color: colors.ink, fontSize: 17, lineHeight: 20, fontWeight: '900' },
  opportunityPerk: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  invite: { color: colors.indigo, fontWeight: '900', marginTop: 'auto' },
});
