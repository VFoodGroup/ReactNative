import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, Alert } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { API_URL } from "../api";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        navigation.navigate("OtpVerification", { email, purpose: "resetPassword" });
      } else {
        const errorMessage = await response.text();
        Alert.alert("Error", errorMessage || "Error sending OTP");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while sending OTP.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bg_forgot.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Title style={styles.title}>Forgot Password</Title>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          style={styles.input}
          autoCapitalize="none"
        />
        <Button
          mode="contained"
          onPress={handleForgotPassword}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Send OTP
        </Button>
        <Text style={styles.note}>
          Enter your registered email to receive an OTP for resetting your password.
        </Text>
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
    fontSize: 26,
    color: "#333",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
    borderRadius: 25,
    marginHorizontal: 50,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  note: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});