import {
  Button,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import { useState } from "react";
import { Stack } from "expo-router";

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [name, setName] = useState(""); // Add name state
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
        // Include the name in the signUp.create() call
        firstName: name,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
    >
      <View style={styles.container}>
        <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
        <Spinner visible={loading} />

        {!pendingVerification && (
          <>
            {/* Add TextInput for the name field */}
            <TextInput
              autoCapitalize="none"
              placeholder="name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              style={styles.inputField}
            />

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
              value={password}
              placeholderTextColor="#999"
              onChangeText={setPassword}
              secureTextEntry
              style={styles.inputField}
            />

            <Button
              onPress={onSignUpPress}
              title="Sign up"
              color={"#6c47ff"}
            ></Button>
          </>
        )}

        {pendingVerification && (
          <>
            <View>
              <TextInput
                value={code}
                placeholder="Code..."
                style={styles.inputField}
                onChangeText={setCode}
              />
            </View>
            <Button
              onPress={onPressVerify}
              title="Verify Email"
              color={"#6c47ff"}
            ></Button>
          </>
        )}
      </View>
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
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default Register;
