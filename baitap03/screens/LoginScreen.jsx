import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, Alert } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { API_URL } from "./Api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        // After successful login, fetch the user's profile.
        const profileResponse = await fetch(`${API_URL}/get-profile?email=${email}`);
        if (profileResponse.ok) {
          const userProfile = await profileResponse.json();
          // Navigate to HomeScreen with profile data
          navigation.navigate("Home", {
            email: userProfile.email,
            fullName: userProfile.fullName,
            // You can pass additional profile fields as needed
          });
        } else {
          Alert.alert("Error", "Unable to fetch user profile.");
        }
      } else {
        Alert.alert("Login Failed", result.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error logging in: ", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg_login.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Title style={styles.title}>Welcome Back</Title>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.loginButton}
          contentStyle={styles.buttonContent}
        >
          Login
        </Button>
        <View style={styles.linksContainer}>
          <Button onPress={() => navigation.navigate("Register")} labelStyle={styles.linkText}>
            Register
          </Button>
          <Button onPress={() => navigation.navigate("ForgotPassword")} labelStyle={styles.linkText}>
            Forgot Password?
          </Button>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.93)",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  linksContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkText: {
    fontSize: 16,
    color: "#6200ee",
  },
});