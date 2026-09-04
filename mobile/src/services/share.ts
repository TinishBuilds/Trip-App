import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';

import { Trip } from '@/data/mock';

export function tripPublicUrl(id: string) {
  return `https://roamtogether.app/t/${id}`;
}

export async function shareTrip(trip: Trip, japanese = false) {
  const title = japanese ? trip.titleJa : trip.title;
  const location = japanese ? trip.locationJa : trip.location;
  const message = japanese
    ? `${title} — ${location}での${trip.distance}の冒険。RoamTogetherでルートを見てみよう！`
    : `${title} — a ${trip.distance} adventure in ${location}. See and copy the route on RoamTogether!`;
  await Share.share({ title, message: `${message}\n${tripPublicUrl(trip.id)}`, url: tripPublicUrl(trip.id) });
}

export async function copyTripLink(id: string) {
  await Clipboard.setStringAsync(tripPublicUrl(id));
}
