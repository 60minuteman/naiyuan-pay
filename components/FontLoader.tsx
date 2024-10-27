import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded] = useFonts({
    'Red Hat Display': require('../assets/fonts/RedHatDisplay-Regular.ttf'),
    'Red Hat Display-Bold': require('../assets/fonts/RedHatDisplay-Bold.ttf'),
    'Red Hat Display-Medium': require('../assets/fonts/RedHatDisplay-Medium.ttf'),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return <View onLayout={onLayoutRootView} style={{ flex: 1 }}>{children}</View>;
};

export default FontLoader;
