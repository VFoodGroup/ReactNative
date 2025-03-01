import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { API_URL } from "./Api";

export default function OtpVerificationScreen({ route, navigation }) {
  const [otp, setOtp] = useState("");
  const { email, purpose } = route.params;

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, purpose }),
      });
      if (response.ok) {
        if (purpose === "register") {
          // Navigate to home or dashboard
          console.log("User registered successfully");
          navigation.navigate("Login");
        } else if (purpose === "resetPassword") {
          // Navigate to Reset Password screen
          navigation.navigate("ResetPassword", { email });
        }
      } else {
        console.error("Invalid OTP");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <TextInput label="OTP" value={otp} onChangeText={setOtp} style={styles.input} />
      <Button mode="contained" onPress={handleVerifyOtp} style={styles.button}>
        Verify OTP
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});
