import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initTts } from './src/services/tts';

enableScreens(true);

function App() {
  useEffect(() => {
    void initTts();
  }, []);

  return (
    <SafeAreaProvider style={styles.fill}>
      <StatusBar barStyle="dark-content" backgroundColor="#87CEEB" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

export default App;
