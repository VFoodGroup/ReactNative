import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const NavigationBar = ({ email }) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Home', { email })}
      >
        <FontAwesome 
          name="home" 
          size={24} 
          color={route.name === 'Home' ? '#fff' : 'rgba(255,255,255,0.7)'} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("Cart", { email })}
      >
        <FontAwesome 
          name="shopping-cart" 
          size={24} 
          color={route.name === 'Cart' ? '#fff' : 'rgba(255,255,255,0.7)'} 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("Profile", { 
          email,
          fullName: route.params?.userProfile?.fullName
        })}
      >
        <FontAwesome 
          name="user" 
          size={24} 
          color={route.name === 'Profile' ? '#fff' : 'rgba(255,255,255,0.7)'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2563eb',
    paddingVertical: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NavigationBar;