import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "./Api";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Media library access is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // updated for new API
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    // Updated for Expo Image Picker v14+: check for 'canceled'
    if (result.canceled) {
      return;
    } else {
      const asset = result.assets && result.assets[0];
      if (asset) {
        // Optionally, you can also set the URI if needed for preview
        setAvatar(`data:image/jpeg;base64,${asset.base64}`);
      }
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill out Full Name, Email, and Password.");
      return;
    }
    setLoading(true);
    const payload = {
      fullName,
      age: age ? Number(age) : undefined,
      phone: phone || undefined,
      email,
      password,
      avt: avatar, // optional avatar field
    };

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const message = await response.text();
      if (response.ok) {
        Alert.alert("Success", message, [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("OtpVerification", {
                email,
                purpose: "register",
              }),
          },
        ]);
      } else {
        Alert.alert("Error", message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput
        label="Full Name *"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Age (Optional)"
        value={age}
        onChangeText={setAge}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
      />
      <TextInput
        label="Phone (Optional)"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
        mode="outlined"
      />
      <TextInput
        label="Email *"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
      />
      <TextInput
        label="Password *"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        mode="outlined"
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Text style={styles.imagePickerText}>Select Avatar</Text>
        )}
      </TouchableOpacity>
      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        contentStyle={styles.buttonContent}
        loading={loading}
      >
        Register
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "stretch",
    backgroundColor: "#f7f7f7",
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    marginBottom: 15,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    width: 120,
    backgroundColor: "#e0e0e0",
    borderRadius: 60,
    alignSelf: "center",
    marginVertical: 20,
  },
  imagePickerText: {
    fontSize: 14,
    color: "#555",
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  button: {
    marginTop: 10,
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});