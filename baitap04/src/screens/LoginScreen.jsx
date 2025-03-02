import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, Alert } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { API_URL } from "../api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      console.log("Attempting login with email:", trimmedEmail);

      // First attempt login
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      // Check if response is JSON before parsing
      const contentType = loginResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server didn't return JSON");
      }

      const loginResult = await loginResponse.json();

      if (loginResponse.ok) {
        // After successful login, fetch profile
        const encodedEmail = encodeURIComponent(trimmedEmail);
        console.log("Fetching profile with encoded email:", encodedEmail);
        
        // Fix: Change endpoint to match backend
        const profileResponse = await fetch(
          `${API_URL}/users/get-profile?email=${encodedEmail}`,
          {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            }
          }
        );
        
        console.log("Profile response status:", profileResponse.status);
        
        if (profileResponse.ok) {
          const userProfile = await profileResponse.json();
          console.log("Retrieved profile:", userProfile);
          
          navigation.reset({
            index: 0,
            routes: [{ 
              name: "Home",
              params: { 
                email: trimmedEmail,
                userProfile
              }
            }],
          });
        } else {
          // Log the error response for debugging
          const errorText = await profileResponse.text();
          console.error("Profile fetch failed. Status:", profileResponse.status);
          console.error("Error response:", errorText);
          Alert.alert(
            "Error", 
            "Unable to fetch user profile. Please try again."
          );
        }
      } else {
        Alert.alert(
          "Login Failed", 
          loginResult.message || "Invalid credentials"
        );
      }
    } catch (error) {
      console.error("Error during login process:", error);
      Alert.alert(
        "Error", 
        "Network error or server unavailable. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bg_login.jpg")}
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
          <Button
            onPress={() => navigation.navigate("Register")}
            labelStyle={styles.linkText}
          >
            Register
          </Button>
          <Button
            onPress={() => navigation.navigate("ForgotPassword")}
            labelStyle={styles.linkText}
          >
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