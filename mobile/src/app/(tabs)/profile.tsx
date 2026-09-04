import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconButton, Pill, Screen, SectionHeader, Stat, TopBar } from '@/components/roam-ui';
import { badges } from '@/data/mock';
import { Language, useI18n } from '@/i18n';
import { usePurchases } from '@/services/purchases';
import { useAppStore } from '@/store/app-store';
import { colors, radius, shadow, spacing } from '@/theme';

export default function ProfileScreen() {
  const { trips } = useAppStore();
  const { isPro } = usePurchases();
  const { language, localize, setLanguage, t } = useI18n();
  const unlocked = badges.filter((badge) => badge.unlocked);

  return (
    <Screen>
      <TopBar title={t('profile')} right={<IconButton icon="settings-outline" accessibilityLabel={t('settings')} />} />
      <View style={styles.identity}>
        <View style={styles.avatar}><Text style={styles.avatarText}>TM</Text></View>
        <View style={styles.identityCopy}>
          <Text style={styles.name}>Tini Martini</Text>
          <Text style={styles.handle}>@tini · Tokyo</Text>
        </View>
        <Pill label={localize('Weekend explorer', '週末トラベラー')} tone="coral" icon="sparkles" />
      </View>

      <View style={styles.stats}>
        <Stat icon="map-outline" value={`${trips.length}`} label={t('trips')} />
        <Stat icon="footsteps-outline" value="40.2 km" label={localize('explored', '歩いた距離')} />
        <Stat icon="people-outline" value="12" label={t('friends')} />
      </View>

      <LinearGradient colors={[colors.indigo, '#7973D8']} style={styles.proCard}>
        <View style={styles.proIcon}><Ionicons name="sparkles" size={23} color={colors.yellow} /></View>
        <View style={styles.proCopy}>
          <View style={styles.proHeading}><Text style={styles.proTitle}>{t('pro')}</Text>{isPro ? <Pill label={localize('ACTIVE', '利用中')} tone="mint" icon="checkmark" /> : null}</View>
          <Text style={styles.proText}>{localize('Unlimited AI plans, premium recaps, and smart budgets.', 'AI旅程、プレミアムまとめ、スマート予算が使い放題。')}</Text>
        </View>
        <Pressable onPress={() => router.push('/subscription')} style={styles.proButton}><Text style={styles.proButtonText}>{isPro ? t('managePlan') : t('unlockPro')}</Text></Pressable>
      </LinearGradient>

      <SectionHeader title={t('badges')} subtitle={`${unlocked.length}/${badges.length} ${t('unlocked')}`} />
      <View style={styles.badgeGrid}>
        {badges.map((badge, index) => (
          <View key={badge.id} style={[styles.badge, !badge.unlocked && styles.badgeLocked]}>
            <View style={[styles.badgeIcon, { backgroundColor: [colors.coralSoft, colors.mint, colors.indigoSoft][index % 3] }]}>
              <Ionicons name={badge.icon as React.ComponentProps<typeof Ionicons>['name']} size={27} color={badge.unlocked ? [colors.coral, colors.green, colors.indigo][index % 3] : colors.muted} />
            </View>
            <View style={styles.badgeCopy}>
              <Text style={styles.badgeTitle}>{localize(badge.title, badge.titleJa)}</Text>
              <Text style={styles.badgeDetail}>{localize(badge.detail, badge.detailJa)}</Text>
            </View>
            <Ionicons name={badge.unlocked ? 'checkmark-circle' : 'lock-closed-outline'} color={badge.unlocked ? colors.green : colors.muted} size={21} />
          </View>
        ))}
      </View>

      <SectionHeader title={t('settings')} />
      <View style={styles.settingsCard}>
        <View style={styles.settingHeading}>
          <View style={styles.settingIcon}><Ionicons name="language" size={20} color={colors.indigo} /></View>
          <Text style={styles.settingLabel}>{t('language')}</Text>
        </View>
        <View style={styles.languages}>
          {([['en', t('english')], ['ja', t('japanese')]] as [Language, string][]).map(([code, label]) => (
            <Pressable key={code} onPress={() => setLanguage(code)} style={[styles.language, language === code && styles.languageActive]}>
              <Text style={[styles.languageText, language === code && styles.languageTextActive]}>{label}</Text>
              {language === code ? <Ionicons name="checkmark" size={18} color={colors.indigo} /> : null}
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', gap: spacing.sm },
  avatar: { width: 92, height: 92, borderRadius: 46, backgroundColor: colors.coralSoft, borderWidth: 5, borderColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadow },
  avatarText: { color: colors.coral, fontSize: 27, fontWeight: '900' },
  identityCopy: { alignItems: 'center' },
  name: { color: colors.ink, fontSize: 25, fontWeight: '900', letterSpacing: -0.7 },
  handle: { color: colors.muted, fontSize: 13, marginTop: 3 },
  stats: { flexDirection: 'row', gap: spacing.sm },
  proCard: { padding: spacing.lg, borderRadius: radius.lg, gap: spacing.md },
  proIcon: { width: 46, height: 46, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  proCopy: { gap: 5 },
  proHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  proTitle: { color: colors.white, fontWeight: '900', fontSize: 22 },
  proText: { color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
  proButton: { height: 43, backgroundColor: colors.white, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  proButtonText: { color: colors.indigo, fontWeight: '900' },
  badgeGrid: { gap: spacing.sm },
  badge: { padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badgeLocked: { opacity: 0.5 },
  badgeIcon: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  badgeCopy: { flex: 1, gap: 3 },
  badgeTitle: { color: colors.ink, fontSize: 15, fontWeight: '900' },
  badgeDetail: { color: colors.muted, fontSize: 12, lineHeight: 16 },
  settingsCard: { padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, gap: spacing.md },
  settingHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  settingIcon: { width: 38, height: 38, borderRadius: 14, backgroundColor: colors.indigoSoft, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  languages: { flexDirection: 'row', gap: spacing.sm },
  language: { flex: 1, height: 45, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  languageActive: { borderColor: colors.indigo, backgroundColor: colors.indigoSoft },
  languageText: { color: colors.muted, fontWeight: '800' },
  languageTextActive: { color: colors.indigo },
});
