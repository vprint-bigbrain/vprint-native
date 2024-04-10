import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={"#fff"} />
    </Pressable>
  );
};

const TabsPage = () => {
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#6c47ff",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "V-PRINT",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="orders"
        options={{
          headerTitle: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
          tabBarLabel: "Orders",
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          tabBarLabel: "My Profile",
          headerRight: () => <LogoutButton />,
          // tabBarItemStyle: { display: "none" },
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="shops/msp1"
        options={{
          headerTitle: "Xerox 1",
          tabBarItemStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="shops/msp2"
        options={{
          headerTitle: "Xerox 2",
          tabBarItemStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="shops/msp3"
        options={{
          headerTitle: "Xerox 3",
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
};

export default TabsPage;
