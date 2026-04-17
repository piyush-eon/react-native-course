import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";
import { useUserSync } from "@/hooks/useUserSync";

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  useUserSync();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return <Slot />;
}
