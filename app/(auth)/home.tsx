import { View, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Card, Text } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { Chip } from "react-native-paper";

const Home = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleCardPress = (xerox) => {
    if (xerox === "msp1") {
      router.push("/shops/msp1");
    } else if (xerox === "msp2") {
      router.push("/shops/msp2");
    } else if (xerox === "msp3") {
      router.push("/shops/msp3");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome {user.fullName} 👋</Text>
      <View style={styles.cardContainer}>
        <Pressable onPress={() => handleCardPress("msp1")}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardTitleContainer}>
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                  AB1 - Ground Floor
                </Text>
                <Chip
                  selectedColor="green"
                  onPress={() => console.log("Pressed")}
                >
                  🟢 Active
                </Chip>
              </View>
              <View style={styles.cardTitleContainer}>
                <Text variant="bodySmall" style={{ marginTop: 30 }}>
                  mspxerox1@gmail.com
                </Text>
                <Text variant="bodySmall" style={{ marginTop: 30 }}>
                  WL: 12{"\n"}
                  Est: 18 min
                </Text>
              </View>
            </Card.Content>
          </Card>
        </Pressable>

        <Pressable onPress={() => handleCardPress("msp2")}>
          <Card style={styles.childCard}>
            <Card.Content>
              <View style={styles.cardTitleContainer}>
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                  AB1 - 6th Floor
                </Text>
                <Chip
                  selectedColor="green"
                  onPress={() => console.log("Pressed")}
                >
                  🟢 Active
                </Chip>
              </View>
              <View style={styles.cardTitleContainer}>
                <Text variant="bodySmall" style={{ marginTop: 30 }}>
                  mspxerox2@gmail.com
                </Text>
                <Text variant="bodySmall" style={{ marginTop: 30 }}>
                  WL: 3{"\n"}
                  Est: 2 min
                </Text>
              </View>
            </Card.Content>
          </Card>
        </Pressable>

        <Pressable onPress={() => handleCardPress("msp3")}>
          <Card style={styles.childCard}>
            <Card.Content>
              <View style={styles.cardTitleContainer}>
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                  AB2 - Basement
                </Text>
                <Chip
                  selectedColor="red"
                  onPress={() => console.log("Pressed")}
                >
                  🔴 Closed
                </Chip>
              </View>
              <View style={styles.cardTitleContainer}>
                <Text variant="bodySmall" style={{ marginTop: 30 }}>
                  mspxerox3@gmail.com
                </Text>
                <Text variant="bodySmall" style={{ marginTop: 30 }}>
                  WL: -{"\n"}
                  Est: -
                </Text>
              </View>
            </Card.Content>
          </Card>
        </Pressable>
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
  },
  childCard: {
    width: "100%",
    marginTop: 20,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chipStyle: {
    fontSize: 10,
  },
});

export default Home;
