import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen</Text>
      <Button mode="contained" onPress={() => navigation.navigate("Profile")} style={styles.button}>
        Go to Profile
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate("Settings")} style={styles.button}>
        Go to Settings
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 10,
  },
});
