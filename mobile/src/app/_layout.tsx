import { StatusBar } from 'expo-status-bar';
import {Stack} from "expo-router"

import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='(auth)' />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
