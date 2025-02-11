import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "./Api";

export default function ProfileScreen({ route, navigation }) {
  // Accept email and fullName from route params (consistent with LoginScreen navigation)
  const { email: initialEmail, fullName: initialFullName } = route.params;
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(initialEmail || "");
  const [avatar, setAvatar] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null); // Base64 image data if a new image is selected
  const [loading, setLoading] = useState(true);

  // Fetch profile data from the API using get-profile endpoint
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          `${API_URL}/get-profile?email=${initialEmail}`
        );
        if (!response.ok) {
          throw new Error("Failed to load profile");
        }
        const data = await response.json();
        setFullName(data.fullName || initialFullName || "");
        setAge(data.age ? String(data.age) : "");
        setPhone(data.phone || "");
        setEmail(data.email || initialEmail);
        setAvatar(data.avt || null);
      } catch (err) {
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [initialEmail, initialFullName]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access media library is required!"
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    // Use the new property "canceled" and access assets array per Expo ImagePicker v14+
    if (!result.canceled) {
      const asset = result.assets && result.assets[0];
      if (asset) {
        setNewAvatar(`data:image/jpeg;base64,${asset.base64}`);
        setAvatar(asset.uri);
      }
    }
  };

  const handleUpdateProfile = async () => {
    const payload = {
      email: initialEmail, // original email used to identify the user
      newFullName: fullName,
      newAge: age,
      newPhone: phone,
      newEmail: email,
      newAvt: newAvatar, // include new avatar data if a new image has been selected
    };

    try {
      const response = await fetch(`${API_URL}/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const message = await response.text();
      if (response.ok) {
        if (message.toLowerCase().includes("verify")) {
          Alert.alert("Success", message, [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("OtpVerification", {
                  email: payload.newEmail || initialEmail,
                  purpose: "update",
                }),
            },
          ]);
        } else {
          Alert.alert("Success", message, [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        }
      } else {
        Alert.alert("Error", message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while updating the profile.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Edit Profile</Title>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Text>Select Avatar</Text>
        )}
      </TouchableOpacity>
      <TextInput
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Age"
        value={age}
        onChangeText={setAge}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
      />
      <TextInput
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
        mode="outlined"
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={handleUpdateProfile}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Update Profile
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
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
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    width: 120,
    backgroundColor: "#ddd",
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});