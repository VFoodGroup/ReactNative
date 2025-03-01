import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
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
        // Navigate to the home screen or dashboard
        navigation.navigate("Home");
      } else {
        Alert.alert("Login Failed", result.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error loggin in: ", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button mode="contained" onPress={handleLogin} loading={loading} disabled={loading} style={styles.button}>
        Login
      </Button>
      <Button onPress={() => navigation.navigate("Register")} style={styles.link}>
        Register
      </Button>
      <Button onPress={() => navigation.navigate("ForgotPassword")} style={styles.link}>
        Forgot Password
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
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  link: {
    marginTop: 10,
    textAlign: "center",
  },
});
