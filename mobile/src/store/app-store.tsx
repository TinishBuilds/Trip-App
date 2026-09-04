import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { initialTrips, Trip, TripKind } from '@/data/mock';

type StoreValue = {
  trips: Trip[];
  cheered: string[];
  savedRoutes: string[];
  placeVotes: Record<string, 'must' | 'interested' | 'skip'>;
  addTrip: (input: { title: string; location: string; duration: string; kind: TripKind; budget?: number }) => string;
  toggleCheer: (id: string) => void;
  toggleSavedRoute: (id: string) => void;
  setPlaceVote: (placeId: string, vote: 'must' | 'interested' | 'skip') => void;
  useCheaperPicks: (tripId: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function AppStoreProvider({ children }: PropsWithChildren) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [cheered, setCheered] = useState<string[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<string[]>([]);
  const [placeVotes, setPlaceVotes] = useState<Record<string, 'must' | 'interested' | 'skip'>>({ meiji: 'must', shibuya: 'must', tsukiji: 'interested' });

  useEffect(() => {
    AsyncStorage.getItem('rt-state').then((raw) => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.trips)) setTrips(saved.trips);
        if (Array.isArray(saved.cheered)) setCheered(saved.cheered);
        if (Array.isArray(saved.savedRoutes)) setSavedRoutes(saved.savedRoutes);
        if (saved.placeVotes && typeof saved.placeVotes === 'object') setPlaceVotes(saved.placeVotes);
      } catch { /* ignore corrupt local prototype data */ }
    });
  }, []);

  useEffect(() => { AsyncStorage.setItem('rt-state', JSON.stringify({ trips, cheered, savedRoutes, placeVotes })).catch(() => undefined); }, [trips, cheered, savedRoutes, placeVotes]);

  const toggleCheer = (id: string) => { Haptics.selectionAsync().catch(() => undefined); setCheered((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); };
  const toggleSavedRoute = (id: string) => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined); setSavedRoutes((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); };
  const setPlaceVote = (placeId: string, vote: 'must' | 'interested' | 'skip') => { Haptics.selectionAsync().catch(() => undefined); setPlaceVotes((current) => ({ ...current, [placeId]: vote })); };
  const useCheaperPicks = (tripId: string) => {
    setTrips((current) => current.map((trip) => trip.id === tripId ? { ...trip, spent: Math.max(0, trip.spent - 4500) } : trip));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  };
  const addTrip = (input: { title: string; location: string; duration: string; kind: TripKind; budget?: number }) => {
    const id = `trip-${Date.now()}`;
    setTrips((current) => [{ id, kind: input.kind, title: input.title, titleJa: input.title, location: input.location, locationJa: input.location, date: 'Just added', dateJa: 'たった今', duration: input.duration, durationJa: input.duration, crew: 1, distance: '0 km', budget: input.budget ?? (input.kind === 'small' ? 5000 : 40000), spent: 0, image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1000&q=85', cheers: 0, badgeCount: input.kind === 'small' ? 1 : 0 }, ...current]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    return id;
  };

  const value = useMemo(() => ({ trips, cheered, savedRoutes, placeVotes, addTrip, toggleCheer, toggleSavedRoute, setPlaceVote, useCheaperPicks }), [trips, cheered, savedRoutes, placeVotes]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useAppStore must be used within AppStoreProvider');
  return value;
}
