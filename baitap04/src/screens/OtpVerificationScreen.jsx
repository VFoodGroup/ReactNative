import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { API_URL } from "../api";

export default function OtpVerificationScreen({ route, navigation }) {
  const { email, purpose } = route?.params || {};

  useEffect(() => {
    if (!email) {
      Alert.alert("Error", "No email provided for OTP verification.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  }, [email, navigation]);

  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    if (!email) return; // safeguard if email is missing
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, purpose }),
      });
      if (response.ok) {
        if (purpose === "register") {
          navigation.navigate("Login");
        } else if (purpose === "resetPassword") {
          navigation.navigate("ResetPassword", { email });
        }
      } else {
        Alert.alert("Error", "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while verifying OTP");
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const message = await response.text();
      if (response.ok) {
        Alert.alert("Success", message);
      } else {
        Alert.alert("Error", message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while resending OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/otp_banner.jpg")}
        style={styles.banner}
        resizeMode="contain"
      />
      <Text style={styles.heading}>OTP Verification</Text>
      <Text style={styles.subHeading}>Enter the OTP sent to your email</Text>
      <TextInput
        label="OTP"
        value={otp}
        onChangeText={setOtp}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
      />
      <Button
        mode="contained"
        onPress={handleVerifyOtp}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Verify OTP
      </Button>
      <Button
        mode="outlined"
        onPress={handleResendOtp}
        style={[styles.button, styles.resendButton]}
        contentStyle={styles.buttonContent}
      >
        Resend OTP
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  banner: {
    width: "100%",
    height: 150,
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  subHeading: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    borderRadius: 25,
    marginHorizontal: 50,
    marginBottom: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resendButton: {
    borderColor: "#6200ee",
  },
});