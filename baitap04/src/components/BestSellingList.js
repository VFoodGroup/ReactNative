import React from 'react';
import { ScrollView, Text, View, Image, StyleSheet } from 'react-native';

const BestSellingList = ({ products }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {products.map((product, index) => (
        <View key={index} style={styles.productCard}>
          <Image 
            source={{ uri: product.image && product.image.length > 0 ? product.image[0] : '' }} 
            style={styles.productImage} 
          />
          <Text style={styles.productName}>{product.name}</Text>
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
  productCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    color: '#e3342f',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default BestSellingList;