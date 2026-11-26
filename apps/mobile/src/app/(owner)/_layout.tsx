import React from 'react';
import { Tabs, usePathname } from 'expo-router';

import { OwnerMobileShell } from '@/pages/owner dashboard/components/OwnerMobileShell';
import { useOwnerMobile } from '@/pages/owner dashboard/context/OwnerMobileContext';
import type { OwnerNavId } from '@/pages/owner dashboard/data/ownerDashboardData';

function pathnameToNavId(pathname: string): OwnerNavId {
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/transactions')) return 'transactions';
  if (pathname.startsWith('/representatives')) return 'representatives';
  if (pathname.startsWith('/find-companies')) return 'find-companies';
  if (pathname.startsWith('/inspectors')) return 'inspectors';
  if (pathname.startsWith('/notifications')) return 'notifications';
  if (pathname.startsWith('/settings')) return 'settings';
  return 'home';
}

export default function OwnerTabsLayout() {
  const pathname = usePathname();
  const { palette } = useOwnerMobile();
  const activeNav = pathnameToNavId(pathname);

  return (
    <OwnerMobileShell activeNav={activeNav}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          animation: 'none',
          sceneStyle: { backgroundColor: palette.canvasBg },
        }}>
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="projects" />
        <Tabs.Screen name="transactions" />
        <Tabs.Screen name="representatives" />
        <Tabs.Screen name="find-companies" />
        <Tabs.Screen name="inspectors" />
        <Tabs.Screen name="notifications" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </OwnerMobileShell>
  );
}
