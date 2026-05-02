import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AnimalSoundsScreen } from '../screens/AnimalSoundsScreen';
import { BakingTimeScreen } from '../screens/BakingTimeScreen';
import { JigsawPuzzleScreen } from '../screens/JigsawPuzzleScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CleanUpScreen } from '../screens/CleanUpScreen';
import { MosquitoHuntScreen } from '../screens/MosquitoHuntScreen';
import { ObstacleGameScreen } from '../screens/ObstacleGameScreen';
import { PlayScreen } from '../screens/PlayScreen';
import { LightningScreen } from '../screens/LightningScreen';
import { RainCatcherScreen } from '../screens/RainCatcherScreen';

export type RootStackParamList = {
  Home: undefined;
  Play: undefined;
  AnimalSounds: undefined;
  ObstacleGame: undefined;
  MosquitoHunt: undefined;
  CleanUp: undefined;
  BakingTime: undefined;
  JigsawPuzzle: undefined;
  RainCatcher: undefined;
  Lightning: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#87CEEB' },
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Play" component={PlayScreen} />
        <Stack.Screen name="AnimalSounds" component={AnimalSoundsScreen} />
        <Stack.Screen name="ObstacleGame" component={ObstacleGameScreen} />
        <Stack.Screen name="MosquitoHunt" component={MosquitoHuntScreen} />
        <Stack.Screen name="CleanUp" component={CleanUpScreen} />
        <Stack.Screen name="BakingTime" component={BakingTimeScreen} />
        <Stack.Screen name="JigsawPuzzle" component={JigsawPuzzleScreen} />
        <Stack.Screen name="RainCatcher" component={RainCatcherScreen} />
        <Stack.Screen name="Lightning" component={LightningScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
