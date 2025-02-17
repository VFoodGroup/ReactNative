import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Text, Image, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const LazyLoadingList = ({ fetchMore }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const numColumns = 2;

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const newProducts = await fetchMore(page);
      if (!newProducts || newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prevProducts => {
          // Prevent duplicates using Set and _id
          const existingIds = new Set(prevProducts.map(p => p._id));
          const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p._id));
          return [...prevProducts, ...uniqueNewProducts];
        });
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchMore]);

  useEffect(() => {
    loadMoreProducts();
  }, []);

  const renderItem = useCallback(({ item }) => {
    const imageSource = item.image && item.image.length > 0 ? item.image[0] : '';
    
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.7}>
        <View style={styles.imageContainer}>
          {imageSource ? (
            <Image 
              source={{ uri: imageSource }} 
              style={styles.productImage}
              defaultSource={require('../../assets/placeholder.png')}
            />
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <FontAwesome name="image" size={24} color="#9ca3af" />
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          {item.quantity <= 0 && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Hết hàng</Text>
            </View>
          )}
        </View>
        <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₫{item.price.toLocaleString()}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.productStar}>{item.star.toFixed(1)}</Text>
          <FontAwesome name="star" size={14} color="#fbbf24" />
          {item.tag && item.tag.length > 0 && (
            <Text style={styles.tagText}>{item.tag[0]}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <FlatList
      key={`grid-${numColumns}`}
      data={products}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      numColumns={numColumns}
      onEndReached={loadMoreProducts}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : !hasMore && products.length > 0 ? (
          <Text style={styles.endListText}>Không còn sản phẩm nào khác</Text>
        ) : null
      }
      ListEmptyComponent={
        !loading && (
          <View style={styles.emptyContainer}>
            <FontAwesome name="shopping-basket" size={50} color="#9ca3af" />
            <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
          </View>
        )
      }
      columnWrapperStyle={styles.columnWrapper}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 4,
    width: Dimensions.get('window').width / 2 - 16,
    padding: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  productName: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 4,
    width: '100%',
  },
  productPrice: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productStar: {
    fontSize: 14,
    color: '#4b5563',
  },
  tagText: {
    fontSize: 12,
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  loaderContainer: {
    padding: 20,
    alignItems: 'center',
  },
  endListText: {
    textAlign: 'center',
    color: '#6b7280',
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    marginTop: 12,
  },
});

export default LazyLoadingList;