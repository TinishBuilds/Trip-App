import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { IconButton, Pill, PrimaryButton, Screen } from '@/components/roam-ui';
import { useI18n } from '@/i18n';
import { usePurchases } from '@/services/purchases';
import { colors, radius, spacing } from '@/theme';

const products = [
  { id: 'monthly', icon: 'calendar-outline', en: 'Monthly', ja: '月額', detailEn: 'Flexible, cancel anytime', detailJa: 'いつでも解約できます' },
  { id: 'yearly', icon: 'sparkles-outline', en: 'Yearly', ja: '年額', detailEn: 'Best for regular explorers', detailJa: '旅好きにいちばんお得' },
  { id: 'lifetime', icon: 'infinite-outline', en: 'Lifetime', ja: '買い切り', detailEn: 'One payment, yours forever', detailJa: '一度の購入でずっと使える' },
];

export default function SubscriptionScreen() {
  const { localize, t } = useI18n();
  const { configured, customerInfo, error, isPro, loading, presentCustomerCenter, presentPaywall, refresh, restore } = usePurchases();

  return (
    <Screen>
      <View style={styles.navigation}>
        <IconButton icon="arrow-back" accessibilityLabel="Back" onPress={() => router.back()} />
        <Text style={styles.navigationTitle}>{t('pro')}</Text>
        <IconButton icon="refresh" accessibilityLabel="Refresh purchases" onPress={refresh} />
      </View>
      <LinearGradient colors={[colors.indigo, '#7C75DF']} style={styles.hero}>
        <View style={styles.heroIcon}><Ionicons name="sparkles" size={31} color={colors.yellow} /></View>
        <Pill label={isPro ? localize('PRO ACTIVE', 'PRO利用中') : localize('TRAVEL MORE TOGETHER', 'もっと一緒に旅しよう')} tone={isPro ? 'mint' : 'coral'} icon={isPro ? 'checkmark-circle' : 'heart'} />
        <Text style={styles.title}>{isPro ? localize('You are all set.', 'Proをお楽しみください。') : localize('Make every plan feel effortless.', '旅の計画を、もっとかんたんに。')}</Text>
        <Text style={styles.subtitle}>{localize('Unlimited smart itineraries, premium share cards, collaborative budgets, and trip insights.', 'スマート旅程、プレミアムシェアカード、共同予算、旅の分析が使い放題。')}</Text>
      </LinearGradient>

      <View style={styles.products}>
        {products.map((product, index) => (
          <View key={product.id} style={[styles.product, index === 1 && styles.productFeatured]}>
            <View style={[styles.productIcon, index === 1 && { backgroundColor: colors.coralSoft }]}><Ionicons name={product.icon as React.ComponentProps<typeof Ionicons>['name']} size={22} color={index === 1 ? colors.coral : colors.indigo} /></View>
            <View style={styles.productCopy}><Text style={styles.productName}>{localize(product.en, product.ja)}</Text><Text style={styles.productDetail}>{localize(product.detailEn, product.detailJa)}</Text></View>
            <Text style={styles.productId}>{product.id}</Text>
          </View>
        ))}
      </View>

      {!configured && !loading ? (
        <View style={styles.notice}><Ionicons name="construct-outline" size={22} color={colors.coral} /><Text style={styles.noticeText}>{localize('Add your RevenueCat public key and make a development build to enable real purchases.', 'RevenueCatの公開キーを追加し、開発ビルドを作成すると購入を有効化できます。')}</Text></View>
      ) : null}
      {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}
      {loading ? <ActivityIndicator color={colors.indigo} /> : null}

      {isPro ? <PrimaryButton label={t('managePlan')} icon="card-outline" onPress={presentCustomerCenter} /> : <PrimaryButton label={t('unlockPro')} icon="sparkles" variant="coral" onPress={presentPaywall} />}
      <PrimaryButton label={localize('Restore purchases', '購入を復元')} icon="refresh-outline" variant="light" onPress={restore} />
      {customerInfo ? <Text style={styles.customer}>{localize('Customer', 'ユーザー')}: {customerInfo.originalAppUserId}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  navigation: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navigationTitle: { color: colors.ink, fontWeight: '900', fontSize: 17 },
  hero: { padding: spacing.xl, borderRadius: radius.lg, gap: spacing.md },
  heroIcon: { width: 58, height: 58, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.white, fontSize: 32, lineHeight: 35, fontWeight: '900', letterSpacing: -1.2 },
  subtitle: { color: 'rgba(255,255,255,0.78)', lineHeight: 21 },
  products: { gap: spacing.sm },
  product: { padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  productFeatured: { borderColor: colors.coral, borderWidth: 2 },
  productIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: colors.indigoSoft, alignItems: 'center', justifyContent: 'center' },
  productCopy: { flex: 1 },
  productName: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  productDetail: { color: colors.muted, fontSize: 12, marginTop: 3 },
  productId: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  notice: { padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.coralSoft, flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  noticeText: { color: colors.ink, flex: 1, lineHeight: 19, fontSize: 13, fontWeight: '700' },
  error: { padding: spacing.md, borderRadius: radius.sm, backgroundColor: '#FFE2E2' },
  errorText: { color: colors.danger, fontSize: 12, fontWeight: '700' },
  customer: { color: colors.muted, textAlign: 'center', fontSize: 11 },
});
