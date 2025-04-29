import { Stack } from "expo-router";
import { BibliothequeNAProvider } from '@/hooks/BibliothequeNAContext';

export default function RootLayout() {
  return (
    <BibliothequeNAProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </BibliothequeNAProvider>
  );
}
