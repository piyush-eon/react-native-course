import { useUserStore } from "@/store/userStore";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  const isAdmin = useUserStore((state) => state.isAdmin);

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <Icon sf="magnifyingglass" />
        <Label>Search</Label>
      </NativeTabs.Trigger>

      {isAdmin && (
        <NativeTabs.Trigger name="create">
          <Icon sf="plus.circle.fill" />
          <Label>Add Property</Label>
        </NativeTabs.Trigger>
      )}

      <NativeTabs.Trigger name="saved">
        <Icon sf="heart.fill" />
        <Label>Saved</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
