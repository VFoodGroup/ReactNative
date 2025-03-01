import React, { useState, useEffect } from "react";
import { View, StyleSheet, ImageBackground, Alert } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { API_URL } from "../api"; // adjust path if necessary

export default function ResetPasswordScreen({ route, navigation }) {
  const [password, setPassword] = useState("");
  const email = route?.params?.email;

  useEffect(() => {
    if (!email) {
      Alert.alert("Error", "No email provided for password reset.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  }, [email]);

  const handleResetPassword = async () => {
    // Prevent proceeding if email is still undefined
    if (!email) return;

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });
      if (response.ok) {
        Alert.alert("Success", "Password reset successful", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        const errorMessage = await response.text();
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error", "An error occurred while resetting password.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bg_reset.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Title style={styles.title}>Reset Password</Title>
        <TextInput
          label="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleResetPassword}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Reset Password
        </Button>
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
    backgroundColor: "rgba(255,255,255,0.9)",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 26,
    color: "#333",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});