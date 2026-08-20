import { createNavigationContainerRef } from '@react-navigation/native';
import { useTabStore } from '@/_state/useTabStore';
import { MainTabType } from '@/components/layout/Layout';

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: any) {
  const lowerName = name.toLowerCase() as MainTabType;
  if (['feed', 'create', 'chat', 'my'].includes(lowerName)) {
    useTabStore.getState().setActiveTab(lowerName);

    if (navigationRef.isReady()) {
      const currentRoute = navigationRef.getCurrentRoute();
      if (currentRoute?.name !== 'Main') {
        navigationRef.navigate('Main');
      }
    }
    return;
  }

  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
