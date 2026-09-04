import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';

import { useI18n } from '@/i18n';
import { colors } from '@/theme';

export default function TabLayout() {
  const { t } = useI18n();
  const icon = (name: React.ComponentProps<typeof Ionicons>['name']) => ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={name} color={color} size={size} />;

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.indigo,
      tabBarInactiveTintColor: colors.muted,
      tabBarLabelStyle: { fontWeight: '800', fontSize: 10, marginTop: 1 },
      tabBarStyle: { position: 'absolute', height: 76, paddingTop: 8, paddingBottom: 10, margin: 12, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.97)', borderTopWidth: 0, elevation: 10, shadowColor: '#11182F', shadowOpacity: 0.12, shadowRadius: 16 },
    }}>
      <Tabs.Screen name="index" options={{ title: t('home'), tabBarIcon: icon('home') }} />
      <Tabs.Screen name="trips" options={{ title: t('trips'), tabBarIcon: icon('map') }} />
      <Tabs.Screen name="discover" options={{ title: t('discover'), tabBarIcon: icon('compass') }} />
      <Tabs.Screen name="profile" options={{ title: t('profile'), tabBarIcon: icon('person') }} />
    </Tabs>
  );
}
