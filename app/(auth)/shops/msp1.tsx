import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";

const MSP1 = () => {
  const navigation = useNavigation();
  const { user } = useUser();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleGoBack}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Pressable onPress={handleGoBack}>
          <Text style={styles.smtext}>Back</Text>
        </Pressable>
      </View>
      <Text style={styles.welcomeText}>MSP Xerox 1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  smtext: {
    fontWeight: "normal",
    fontSize: 15,
    marginLeft: 10,
  },
});

export default MSP1;
