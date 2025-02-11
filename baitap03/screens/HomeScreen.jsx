import React, { useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Text, Button } from "react-native-paper";

export default function HomeScreen({ navigation, route }) {
  const [userData] = useState({
    email: route.params?.email || "",
    fullName: route.params?.fullName || "Guest",
  });

  return (
    <ImageBackground
      source={require("../assets/bg_home.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {userData.fullName}</Text>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("Profile", { email: userData.email })
          }
          style={styles.button}
        >
          Go to Profile
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Settings")}
          style={styles.button}
        >
          Go to Settings
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
  container: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  button: {
    marginTop: 10,
    width: "80%",
  },
});