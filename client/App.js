import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faHamburger, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import RootNavigator from './components/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync();

const fetchFonts = () => {
  return Font.loadAsync({
    'Oswald-Bold': require('./assets/fonts/Oswald-Bold.ttf'),
    'Oswald-ExtraLight': require('./assets/fonts/Oswald-ExtraLight.ttf'),
    'Oswald-Light': require('./assets/fonts/Oswald-Light.ttf'),
    'Oswald-Medium': require('./assets/fonts/Oswald-Medium.ttf'),
    'Oswald-Regular': require('./assets/fonts/Oswald-Regular.ttf'),
    'Oswald-SemiBold': require('./assets/fonts/Oswald-SemiBold.ttf'),
    'SpaceMono-Bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
    'SpaceMono-BoldItalic': require('./assets/fonts/SpaceMono-BoldItalic.ttf'),
    'SpaceMono-Italic': require('./assets/fonts/SpaceMono-Italic.ttf'),
    'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
  });
};

library.add(faCoffee, faHamburger, faMagnifyingGlassPlus);

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Render nothing until the fonts are loaded
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;
