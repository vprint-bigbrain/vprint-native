import { useSignIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Button } from "react-native-paper";

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Spinner visible={loading} />
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🖨️</Text>
        <Text style={styles.title}>vprint</Text>
      </View>
      <TextInput
        autoCapitalize="none"
        placeholder="simon.says2023@vitstudent.ac.in"
        placeholderTextColor="#999"
        value={emailAddress}
        onChangeText={setEmailAddress}
        style={styles.inputField}
      />

      <TextInput
        placeholder="password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
      />

      {/* <Button onPress={onSignInPress} title="Login" color={"#6c47ff"}></Button> */}
      <Button
        icon="login"
        mode="contained"
        onPress={onSignInPress}
        style={{ marginVertical: 4 }}
      >
        Login
      </Button>
      <Button
        icon="alpha-v-circle"
        mode="outlined"
        onPress={() => console.log("Pressed")}
        style={{ marginTop: 10 }}
      >
        Login with VTOP
      </Button>
      <Link href="/reset" asChild>
        <Pressable style={styles.button}>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
      <Link href="/register" asChild>
        <Pressable style={styles.button}>
          <Text>Create Account</Text>
        </Pressable>
      </Link>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    color: "black",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    fontSize: 100,
  },
});

export default Login;
