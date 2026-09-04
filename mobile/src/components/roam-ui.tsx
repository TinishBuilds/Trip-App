import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren, ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Trip } from '@/data/mock';
import { useI18n } from '@/i18n';
import { colors, radius, shadow, spacing } from '@/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function Screen({ children, contentContainerStyle, ...props }: PropsWithChildren<ScrollViewProps>) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.screen, contentContainerStyle]}
        {...props}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function TopBar({ title = 'RoamTogether', right }: { title?: string; right?: ReactNode }) {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}><Ionicons name="navigate" size={18} color={colors.white} /></View>
        <Text style={styles.brand}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

export function SectionHeader({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action ? <Pressable hitSlop={10} onPress={onAction}><Text style={styles.sectionAction}>{action}</Text></Pressable> : null}
    </View>
  );
}

export function Pill({ label, icon, tone = 'indigo' }: { label: string; icon?: IconName; tone?: 'indigo' | 'coral' | 'mint' | 'dark' }) {
  const palette = {
    indigo: [colors.indigoSoft, colors.indigo], coral: [colors.coralSoft, colors.coral],
    mint: [colors.mint, colors.green], dark: [colors.black, colors.white],
  }[tone];
  return (
    <View style={[styles.pill, { backgroundColor: palette[0] }]}>
      {icon ? <Ionicons name={icon} size={13} color={palette[1]} /> : null}
      <Text style={[styles.pillText, { color: palette[1] }]}>{label}</Text>
    </View>
  );
}

export function PrimaryButton({ label, icon = 'arrow-forward', onPress, variant = 'primary', disabled = false, style }: {
  label: string; icon?: IconName; onPress?: () => void; variant?: 'primary' | 'light' | 'coral'; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const isLight = variant === 'light';
  const backgroundColor = isLight ? colors.white : variant === 'coral' ? colors.coral : colors.indigo;
  const foreground = isLight ? colors.indigo : colors.white;
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, { backgroundColor, opacity: disabled ? 0.5 : pressed ? 0.86 : 1 }, style]}>
      <Text style={[styles.buttonText, { color: foreground }]}>{label}</Text>
      <Ionicons name={icon} size={18} color={foreground} />
    </Pressable>
  );
}

export function IconButton({ icon, onPress, light = false, accessibilityLabel }: { icon: IconName; onPress?: () => void; light?: boolean; accessibilityLabel: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => [styles.iconButton, light && styles.iconButtonLight, pressed && { opacity: 0.72 }]}>
      <Ionicons name={icon} size={21} color={light ? colors.white : colors.ink} />
    </Pressable>
  );
}

export function AvatarStack({ count = 4, dark = false }: { count?: number; dark?: boolean }) {
  const initials = ['Y', 'H', 'J', 'M', '+'];
  return (
    <View style={styles.avatars}>
      {Array.from({ length: Math.min(count, 5) }).map((_, index) => (
        <View key={index} style={[styles.avatar, { marginLeft: index ? -8 : 0, backgroundColor: dark ? colors.white : [colors.coralSoft, colors.mint, colors.indigoSoft, '#FFF0C6'][index % 4] }]}>
          <Text style={[styles.avatarText, dark && { color: colors.indigo }]}>{initials[index]}</Text>
        </View>
      ))}
    </View>
  );
}

export function TripCard({ trip, onPress, onShare, compact = false }: { trip: Trip; onPress?: () => void; onShare?: () => void; compact?: boolean }) {
  const { localize, t } = useI18n();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tripCard, compact && styles.tripCardCompact, pressed && { transform: [{ scale: 0.99 }] }]}>
      <Image source={{ uri: trip.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
      <LinearGradient colors={['rgba(17,24,47,0.04)', 'rgba(17,24,47,0.92)']} locations={[0.25, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.tripTop}>
        <Pill label={trip.kind === 'small' ? t('smallTrip') : trip.date} icon={trip.kind === 'small' ? 'sunny-outline' : 'calendar-outline'} tone="dark" />
        <IconButton icon="share-outline" onPress={onShare} light accessibilityLabel={t('share')} />
      </View>
      <View style={styles.tripBottom}>
        <Text numberOfLines={2} style={[styles.tripTitle, compact && { fontSize: 22 }]}>{localize(trip.title, trip.titleJa)}</Text>
        <Text style={styles.tripMeta}>{localize(trip.location, trip.locationJa)} · {localize(trip.duration, trip.durationJa)} · {trip.distance}</Text>
        <View style={styles.tripFooter}>
          <AvatarStack count={trip.crew} dark />
          <View style={styles.tripStats}>
            <Ionicons name="heart" size={15} color={colors.coral} />
            <Text style={styles.tripStatText}>{trip.cheers}</Text>
            <Ionicons name="ribbon-outline" size={16} color={colors.yellow} />
            <Text style={styles.tripStatText}>{trip.badgeCount}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function Stat({ icon, value, label }: { icon: IconName; value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={20} color={colors.indigo} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  screen: { paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.lg },
  topBar: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.indigo, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-10deg' }] },
  brand: { color: colors.ink, fontWeight: '900', fontSize: 21, letterSpacing: -0.7 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.sm },
  sectionCopy: { flex: 1, gap: 3 },
  sectionTitle: { color: colors.ink, fontWeight: '900', fontSize: 24, letterSpacing: -0.7 },
  sectionSubtitle: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  sectionAction: { color: colors.indigo, fontWeight: '800', fontSize: 14 },
  pill: { minHeight: 29, paddingHorizontal: 11, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  pillText: { fontWeight: '800', fontSize: 11, letterSpacing: 0.2 },
  button: { height: 50, borderRadius: radius.pill, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, ...shadow },
  buttonText: { fontSize: 15, fontWeight: '900' },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  iconButtonLight: { backgroundColor: 'rgba(17,24,47,0.46)', borderColor: 'rgba(255,255,255,0.34)' },
  avatars: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 29, height: 29, borderRadius: 15, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 10, fontWeight: '900', color: colors.ink },
  tripCard: { minHeight: 390, borderRadius: radius.lg, overflow: 'hidden', padding: spacing.md, justifyContent: 'space-between', backgroundColor: colors.black, ...shadow },
  tripCardCompact: { width: 276, minHeight: 340, marginRight: spacing.md },
  tripTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  tripBottom: { gap: spacing.sm },
  tripTitle: { color: colors.white, fontWeight: '900', fontSize: 31, lineHeight: 34, letterSpacing: -1.2 },
  tripMeta: { color: 'rgba(255,255,255,0.82)', fontWeight: '600', fontSize: 13 },
  tripFooter: { marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tripStats: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tripStatText: { color: colors.white, fontWeight: '800', marginRight: 5 },
  stat: { flex: 1, padding: spacing.md, alignItems: 'center', gap: 3, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  statValue: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 11, fontWeight: '700' },
});
