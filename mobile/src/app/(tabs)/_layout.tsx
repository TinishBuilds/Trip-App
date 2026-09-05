import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';

import { useI18n } from '@/i18n';
import { colors } from '@/theme';

type TabIconProps = { color: ColorValue; size: number };
type IconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(name: IconName) {
  function TabBarIcon({ color, size }: TabIconProps) {
    return <Ionicons name={name} color={color} size={size} />;
  }

  return TabBarIcon;
}

const HomeTabIcon = tabIcon('home');
const TripsTabIcon = tabIcon('map');
const DiscoverTabIcon = tabIcon('compass');
const ProfileTabIcon = tabIcon('person');

export default function TabLayout() {
  const { t } = useI18n();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.indigo,
      tabBarInactiveTintColor: colors.muted,
      tabBarLabelStyle: { fontWeight: '800', fontSize: 10, marginTop: 1 },
      tabBarStyle: { position: 'absolute', height: 76, paddingTop: 8, paddingBottom: 10, margin: 12, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.97)', borderTopWidth: 0, elevation: 10, shadowColor: '#11182F', shadowOpacity: 0.12, shadowRadius: 16 },
    }}>
      <Tabs.Screen name="index" options={{ title: t('home'), tabBarIcon: HomeTabIcon }} />
      <Tabs.Screen name="trips" options={{ title: t('trips'), tabBarIcon: TripsTabIcon }} />
      <Tabs.Screen name="discover" options={{ title: t('discover'), tabBarIcon: DiscoverTabIcon }} />
      <Tabs.Screen name="profile" options={{ title: t('profile'), tabBarIcon: ProfileTabIcon }} />
    </Tabs>
  );
}
