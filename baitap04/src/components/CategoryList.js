import React from 'react';
import { ScrollView, Text, View, Image, StyleSheet } from 'react-native';

const CategoryList = ({ categories }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {categories.map((cat, index) => (
        <View key={index} style={styles.categoryCard}>
          <Image source={{ uri: cat.image }} style={styles.categoryImage} />
          <Text style={styles.categoryName}>{cat.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryName: {
    color: '#e3342f', // red-500
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CategoryList;