import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Card, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { Chip } from "react-native-paper";

import { supabase } from "../utils/supabase";

const Home = () => {
  const { user } = useUser();
  const router = useRouter();
  const [shopData, setShopData] = useState([]);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const { data, error } = await supabase
          .from("shopDetails")
          .select("*")
          .in("name", ["msp1", "msp2", "msp3"]);
        if (error) {
          throw error;
        }
        setShopData(data);
      } catch (error) {
        console.error("Error fetching shop data:", error.message);
      }
    };

    fetchShopData();
  }, []);

  const handleCardPress = (shopName) => {
    router.push(`/shops/${shopName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome {user.fullName} 👋</Text>
      <View style={styles.cardContainer}>
        {shopData
          .sort((a, b) => {
            // Sort alphabetically based on 'name'
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          })
          .map((shop) => (
            <Pressable
              key={shop.name}
              onPress={() => handleCardPress(shop.name)}
            >
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardTitleContainer}>
                    <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                      {shop.label}
                    </Text>
                    <Chip
                      selectedColor={shop.isOpen ? "green" : "red"}
                      onPress={() => console.log("Pressed")}
                    >
                      {shop.isOpen ? `🟢 Open` : "🔴 Closed"}
                    </Chip>
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text variant="bodySmall" style={{ marginTop: 30 }}>
                      {shop.email}
                    </Text>
                    <Text variant="bodySmall" style={{ marginTop: 30 }}>
                      WL: {shop.orders}
                      {"\n"}
                      Est: {shop.estimatedTime} min
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </Pressable>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  cardContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  card: {
    width: "100%",
    marginTop: 20,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default Home;
