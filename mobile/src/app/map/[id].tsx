import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton, Pill, PrimaryButton } from '@/components/roam-ui';
import { places } from '@/data/mock';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/app-store';
import { colors, radius, shadow, spacing } from '@/theme';

export default function TripMapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips } = useAppStore();
  const { localize, t } = useI18n();
  const map = useRef<MapView>(null);
  const trip = trips.find((item) => item.id === id) ?? trips[0];
  const route = places.map(({ latitude, longitude }) => ({ latitude, longitude }));

  return (
    <View style={styles.container}>
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude: 35.692, longitude: 139.742, latitudeDelta: 0.18, longitudeDelta: 0.18 }}
        mapPadding={{ top: 110, right: 20, bottom: 265, left: 20 }}
        showsCompass
        showsMyLocationButton={false}>
        <Polyline coordinates={route} strokeColor={colors.indigo} strokeWidth={5} lineDashPattern={[1]} />
        {places.map((place, index) => (
          <Marker key={place.id} coordinate={{ latitude: place.latitude, longitude: place.longitude }}>
            <View style={styles.marker}><Text style={styles.markerText}>{index + 1}</Text></View>
            <Callout><View style={styles.callout}><Text style={styles.calloutTitle}>{localize(place.name, place.nameJa)}</Text><Text style={styles.calloutText}>{localize(place.area, place.areaJa)}</Text></View></Callout>
          </Marker>
        ))}
      </MapView>
      <LinearMapTint />
      <SafeAreaView pointerEvents="box-none" style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <IconButton icon="arrow-back" accessibilityLabel="Back" onPress={() => router.back()} />
          <View style={styles.mapTitle}><Text numberOfLines={1} style={styles.mapTitleText}>{localize(trip.title, trip.titleJa)}</Text><Text style={styles.mapSubtitle}>{places.length} {t('stops')} · {trip.distance}</Text></View>
          <IconButton icon="locate" accessibilityLabel="Show route" onPress={() => map.current?.fitToCoordinates(route, { edgePadding: { top: 150, right: 50, bottom: 300, left: 50 }, animated: true })} />
        </View>
        <View style={styles.bottomSheet}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}><View><Text style={styles.sheetTitle}>{localize('Your route', 'あなたのルート')}</Text><Text style={styles.sheetSubtitle}>{localize('Tap a pin for details', 'ピンをタップして詳細を見る')}</Text></View><Pill label={localize('Live map', 'ライブマップ')} icon="navigate" tone="coral" /></View>
          <View style={styles.stopPreview}>
            {places.slice(0, 3).map((place, index) => <View key={place.id} style={styles.stop}><View style={styles.stopNumber}><Text style={styles.stopNumberText}>{index + 1}</Text></View><Text numberOfLines={1} style={styles.stopName}>{localize(place.name, place.nameJa)}</Text></View>)}
          </View>
          <PrimaryButton label={t('recap')} icon="images-outline" onPress={() => router.push({ pathname: '/recap/[id]', params: { id: trip.id } })} />
        </View>
      </SafeAreaView>
    </View>
  );
}

function LinearMapTint() {
  return <View pointerEvents="none" style={styles.mapTint} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DDE6E0' },
  mapTint: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(255,248,238,0.05)' },
  safe: { flex: 1, justifyContent: 'space-between', paddingHorizontal: spacing.md },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  mapTitle: { flex: 1, minHeight: 52, paddingHorizontal: spacing.md, justifyContent: 'center', borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.96)', ...shadow },
  mapTitleText: { color: colors.ink, fontWeight: '900', fontSize: 14 },
  mapSubtitle: { color: colors.muted, fontSize: 11, marginTop: 2 },
  marker: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.coral, borderWidth: 4, borderColor: colors.white, justifyContent: 'center', alignItems: 'center', ...shadow },
  markerText: { color: colors.white, fontWeight: '900' },
  callout: { minWidth: 150, padding: 6 },
  calloutTitle: { color: colors.ink, fontWeight: '900' },
  calloutText: { color: colors.muted, marginTop: 2 },
  bottomSheet: { padding: spacing.lg, paddingTop: spacing.sm, backgroundColor: colors.white, borderRadius: radius.lg, gap: spacing.md, ...shadow },
  handle: { width: 42, height: 5, backgroundColor: colors.line, borderRadius: 3, alignSelf: 'center' },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  sheetTitle: { color: colors.ink, fontWeight: '900', fontSize: 21 },
  sheetSubtitle: { color: colors.muted, fontSize: 12, marginTop: 3 },
  stopPreview: { flexDirection: 'row', gap: 6 },
  stop: { flex: 1, minWidth: 0, alignItems: 'center', gap: 5 },
  stopNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.indigoSoft, alignItems: 'center', justifyContent: 'center' },
  stopNumberText: { color: colors.indigo, fontWeight: '900', fontSize: 11 },
  stopName: { color: colors.ink, fontSize: 10, fontWeight: '700', maxWidth: '100%' },
});
