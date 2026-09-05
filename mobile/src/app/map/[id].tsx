import {
  Camera,
  type CameraRef,
  GeoJSONSource,
  Layer,
  Map,
  Marker,
  type LngLat,
  type LngLatBounds,
} from '@maplibre/maplibre-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Feature, LineString } from 'geojson';

import { IconButton, Pill, PrimaryButton } from '@/components/roam-ui';
import { places } from '@/data/mock';
import { useI18n } from '@/i18n';
import { useAppStore } from '@/store/app-store';
import { colors, radius, shadow, spacing } from '@/theme';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';
const MAP_PADDING = { top: 130, right: 50, bottom: 330, left: 50 };

export default function TripMapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips } = useAppStore();
  const { localize, t } = useI18n();
  const camera = useRef<CameraRef>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const trip = trips.find((item) => item.id === id) ?? trips[0];
  const selectedPlace = places.find((place) => place.id === selectedPlaceId);
  const route = useMemo<LngLat[]>(
    () => places.map(({ latitude, longitude }) => [longitude, latitude]),
    [],
  );
  const routeBounds = useMemo<LngLatBounds>(() => {
    const longitudes = route.map(([longitude]) => longitude);
    const latitudes = route.map(([, latitude]) => latitude);
    return [Math.min(...longitudes), Math.min(...latitudes), Math.max(...longitudes), Math.max(...latitudes)];
  }, [route]);
  const routeLine = useMemo<Feature<LineString>>(() => ({
    type: 'Feature',
    properties: { tripId: trip.id },
    geometry: { type: 'LineString', coordinates: route },
  }), [route, trip.id]);

  return (
    <View style={styles.container}>
      <Map
        style={StyleSheet.absoluteFill}
        mapStyle={MAP_STYLE}
        androidView="texture"
        compass
        compassPosition={{ top: 94, right: 14 }}
        attribution
        attributionPosition={{ bottom: 278, right: 8 }}
        logo
        logoPosition={{ bottom: 278, left: 8 }}>
        <Camera ref={camera} initialViewState={{ bounds: routeBounds, padding: MAP_PADDING }} />
        <GeoJSONSource id="trip-route" data={routeLine}>
          <Layer
            id="trip-route-line"
            type="line"
            source="trip-route"
            paint={{ 'line-color': colors.indigo, 'line-width': 5, 'line-opacity': 0.9 }}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          />
        </GeoJSONSource>
        {places.map((place, index) => (
          <Marker
            id={place.id}
            key={place.id}
            lngLat={[place.longitude, place.latitude]}
            anchor="bottom"
            onPress={() => setSelectedPlaceId(place.id)}>
            <View style={[styles.marker, selectedPlaceId === place.id && styles.markerSelected]}>
              <Text style={styles.markerText}>{index + 1}</Text>
            </View>
          </Marker>
        ))}
      </Map>
      <LinearMapTint />
      <SafeAreaView pointerEvents="box-none" style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <IconButton icon="arrow-back" accessibilityLabel="Back" onPress={() => router.back()} />
          <View style={styles.mapTitle}><Text numberOfLines={1} style={styles.mapTitleText}>{localize(trip.title, trip.titleJa)}</Text><Text style={styles.mapSubtitle}>{places.length} {t('stops')} · {trip.distance}</Text></View>
          <IconButton icon="locate" accessibilityLabel="Show route" onPress={() => camera.current?.fitBounds(routeBounds, { padding: MAP_PADDING, duration: 650, easing: 'ease' })} />
        </View>
        <View style={styles.bottomSheet}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}><View style={styles.sheetHeading}><Text style={styles.sheetTitle}>{localize('Your route', 'あなたのルート')}</Text><Text numberOfLines={1} style={styles.sheetSubtitle}>{selectedPlace ? `${localize(selectedPlace.name, selectedPlace.nameJa)} · ${localize(selectedPlace.area, selectedPlace.areaJa)} · ${selectedPlace.price === 0 ? localize('Free', '無料') : `¥${selectedPlace.price.toLocaleString()}`}` : localize('Tap a pin for details', 'ピンをタップして詳細を見る')}</Text></View><Pill label={localize('Live map', 'ライブマップ')} icon="navigate" tone="coral" /></View>
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
  markerSelected: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.indigo },
  markerText: { color: colors.white, fontWeight: '900' },
  bottomSheet: { padding: spacing.lg, paddingTop: spacing.sm, backgroundColor: colors.white, borderRadius: radius.lg, gap: spacing.md, ...shadow },
  handle: { width: 42, height: 5, backgroundColor: colors.line, borderRadius: 3, alignSelf: 'center' },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  sheetHeading: { flex: 1, minWidth: 0, paddingRight: spacing.sm },
  sheetTitle: { color: colors.ink, fontWeight: '900', fontSize: 21 },
  sheetSubtitle: { color: colors.muted, fontSize: 12, marginTop: 3 },
  stopPreview: { flexDirection: 'row', gap: 6 },
  stop: { flex: 1, minWidth: 0, alignItems: 'center', gap: 5 },
  stopNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.indigoSoft, alignItems: 'center', justifyContent: 'center' },
  stopNumberText: { color: colors.indigo, fontWeight: '900', fontSize: 11 },
  stopName: { color: colors.ink, fontSize: 10, fontWeight: '700', maxWidth: '100%' },
});
