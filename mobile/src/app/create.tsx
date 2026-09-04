import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { IconButton, PrimaryButton, Screen } from '@/components/roam-ui';
import { TripKind } from '@/data/mock';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/app-store';
import { colors, radius, spacing } from '@/theme';

export default function CreateTripScreen() {
  const params = useLocalSearchParams<{ kind?: TripKind }>();
  const { addTrip } = useAppStore();
  const { localize, t } = useI18n();
  const [kind, setKind] = useState<TripKind>(params.kind === 'small' ? 'small' : 'full');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState(kind === 'small' ? '5000' : '40000');

  const submit = () => {
    if (!title.trim() || !location.trim()) return;
    const id = addTrip({ title: title.trim(), location: location.trim(), duration: duration.trim() || (kind === 'small' ? localize('2 hours', '2時間') : localize('3 days', '3日間')), kind, budget: Number(budget) || undefined });
    router.replace({ pathname: '/trip/[id]', params: { id } });
  };

  return (
    <Screen>
      <View style={styles.navigation}>
        <IconButton icon="close" accessibilityLabel={t('cancel')} onPress={() => router.back()} />
        <Text style={styles.navigationTitle}>{t('logTrip')}</Text>
        <View style={{ width: 42 }} />
      </View>
      <View style={styles.intro}>
        <Text style={styles.title}>{t('createTitle')}</Text>
        <Text style={styles.subtitle}>{localize('Big journeys and little escapes belong in the same story.', '大きな旅も小さなおでかけも、同じ物語に残そう。')}</Text>
      </View>
      <View style={styles.kindRow}>
        {([
          ['small', 'sunny-outline', t('smallTrip'), localize('Under one day', '1日以内')],
          ['full', 'map-outline', t('fullTrip'), localize('One night or more', '1泊以上')],
        ] as [TripKind, React.ComponentProps<typeof Ionicons>['name'], string, string][]).map(([value, icon, label, detail]) => (
          <Pressable key={value} onPress={() => { setKind(value); setBudget(value === 'small' ? '5000' : '40000'); }} style={[styles.kindCard, kind === value && styles.kindActive]}>
            <View style={[styles.kindIcon, kind === value && styles.kindIconActive]}><Ionicons name={icon} size={24} color={kind === value ? colors.white : colors.indigo} /></View>
            <Text style={[styles.kindLabel, kind === value && styles.kindLabelActive]}>{label}</Text>
            <Text style={[styles.kindDetail, kind === value && styles.kindDetailActive]}>{detail}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.form}>
        <Field label={t('titleLabel')} icon="sparkles-outline" value={title} onChangeText={setTitle} placeholder={localize('Sunday ramen hunt', '日曜日のラーメン巡り')} />
        <Field label={t('destination')} icon="location-outline" value={location} onChangeText={setLocation} placeholder={localize('Kichijoji', '吉祥寺')} />
        <Field label={t('duration')} icon="time-outline" value={duration} onChangeText={setDuration} placeholder={kind === 'small' ? localize('3 hours', '3時間') : localize('3 days', '3日間')} />
        <Field label={t('budget')} icon="wallet-outline" value={budget} onChangeText={setBudget} keyboardType="number-pad" prefix="¥" />
      </View>
      <PrimaryButton disabled={!title.trim() || !location.trim()} label={t('saveAdventure')} icon="checkmark" onPress={submit} />
    </Screen>
  );
}

function Field({ label, icon, prefix, ...props }: React.ComponentProps<typeof TextInput> & { label: string; icon: React.ComponentProps<typeof Ionicons>['name']; prefix?: string }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name={icon} size={20} color={colors.indigo} />
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput placeholderTextColor={colors.muted} style={styles.input} {...props} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navigation: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navigationTitle: { color: colors.ink, fontWeight: '900', fontSize: 17 },
  intro: { gap: spacing.sm },
  title: { color: colors.ink, fontSize: 35, lineHeight: 39, fontWeight: '900', letterSpacing: -1.4 },
  subtitle: { color: colors.muted, lineHeight: 21 },
  kindRow: { flexDirection: 'row', gap: spacing.sm },
  kindCard: { flex: 1, padding: spacing.md, minHeight: 155, borderRadius: radius.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, gap: spacing.sm },
  kindActive: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  kindIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.indigoSoft, justifyContent: 'center', alignItems: 'center' },
  kindIconActive: { backgroundColor: 'rgba(255,255,255,0.16)' },
  kindLabel: { color: colors.ink, fontWeight: '900', fontSize: 16 },
  kindLabelActive: { color: colors.white },
  kindDetail: { color: colors.muted, fontSize: 12 },
  kindDetailActive: { color: 'rgba(255,255,255,0.7)' },
  form: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, gap: spacing.lg },
  fieldGroup: { gap: 7 },
  fieldLabel: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  inputWrap: { minHeight: 52, paddingHorizontal: spacing.md, borderRadius: radius.sm, backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  prefix: { color: colors.ink, fontWeight: '900', marginRight: -7 },
  input: { flex: 1, color: colors.ink, fontSize: 15, fontWeight: '700' },
});
