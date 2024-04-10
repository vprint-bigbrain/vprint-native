import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Card, Divider, Text } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../utils/supabase";

const Orders = () => {
  const { user } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const scrollViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("email", user.emailAddresses[0].emailAddress)
          .eq("isAvailable", false);

        if (error) {
          throw error;
        }

        setOrders(data);
      } catch (error) {
        console.error("Error fetching order data:", error.message);
      }
    };

    fetchOrders();

    // Subscribe to changes in the "orders" table
    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          // Update the orders state with the new data
          fetchOrders();
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleScroll = async (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    // Check if the user has scrolled near the bottom
    if (scrollY + screenHeight >= contentHeight - 50 && !isLoading) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("email", user.emailAddresses[0].emailAddress);

        if (error) {
          throw error;
        }

        setOrders(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order data:", error.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={200}
      style={styles.container}
    >
      <Text style={styles.welcomeText}>Your Orders</Text>
      <View style={styles.cardContainer}>
        {orders.map((order) => (
          <View key={order.id} style={{ marginTop: 20 }}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>
                <Ionicons
                  name="logo-dropbox"
                  size={20}
                  style={{ marginRight: 100 }}
                />
                &#8203; &#8203; &#8203;
                {order.shop === "msp1"
                  ? "MSP Xerox 1"
                  : order.shop === "msp2"
                  ? "MSP Xerox 2"
                  : "MSP Xerox 3"}
              </Text>
            </View>
            <Text style={styles.orderDetails}>
              <Text style={{ fontWeight: "normal" }}>
                {new Date(order.created_at)
                  .toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(
                    /(\d+)\/(\d+)\/(\d+)/,
                    (_, d, m, y) =>
                      `${d}${
                        ["th", "st", "nd", "rd"][
                          d % 10 > 3 ? 0 : d - (d % 10) !== 10 ? d % 10 : 0
                        ]
                      } ${new Date(y, m - 1, 1).toLocaleString("en-US", {
                        month: "short",
                      })}, ${y}`
                  )}{" "}
                |{" "}
                {new Date(order.created_at)
                  .toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })
                  .replace(/(:\d{2}| [AP]M)$/, "")}
              </Text>
            </Text>

            <View style={styles.cardTitleContainer}>
              <Text style={styles.orderDetails}>
                <Link href={order.document_url} style={{ color: "blue" }}>
                  View File
                </Link>
              </Text>

              <Text style={styles.orderDetails}>
                Price:{" "}
                <Text style={styles.orderValue}>&#8377;{order.price}</Text>
              </Text>
            </View>
            <Divider />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  card: {
    width: "100%",
    marginVertical: 10,
    elevation: 3,
  },
  cardTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  orderValue: {
    fontWeight: "bold",
  },
});

export default Orders;
