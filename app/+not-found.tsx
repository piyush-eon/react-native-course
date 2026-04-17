import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-8">
      <Ionicons name="search-outline" size={48} color="#D1D5DB" />

      <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
        Page not found
      </Text>
      <Text className="text-gray-400 text-sm text-center mb-8">
        This page does not exist or has been moved.
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/(root)/(tabs)")}
        className="bg-blue-600 px-8 py-3 rounded-2xl"
      >
        <Text className="text-white font-semibold">Go Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
