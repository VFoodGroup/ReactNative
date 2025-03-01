import React, { useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import { API_URL } from "./Api";

export default function ResetPasswordScreen({ route, navigation }) {
  const [password, setPassword] = useState("");
  const { email } = route.params;

  const handleResetPassword = async () => {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });
      if (response.ok) {
        console.log("Password reset successful");
        navigation.navigate("Login");
      } else {
        console.error("Error resetting password");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg_reset.jpg")}
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