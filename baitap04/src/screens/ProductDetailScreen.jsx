import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { fetchProductById } from "../api";
import { FontAwesome } from "@expo/vector-icons";

const ProductDetailScreen = ({ route, navigation }) => {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            const data = await fetchProductById(productId);
            if (data) {
                setProduct(data);
            }
            setLoading(false);
        };
        loadProduct();
    }, [productId]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.loaderContainer}>
                <Text>Không tìm thấy sản phẩm</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: product.image[0] }} style={styles.productImage} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>₫{product.price.toLocaleString()}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <View style={styles.ratingContainer}>
                <Text style={styles.productStar}>{product.star.toFixed(1)}</Text>
                <FontAwesome name="star" size={16} color="#fbbf24" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    productImage: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        resizeMode: "cover",
    },
    productName: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 10,
    },
    productPrice: {
        fontSize: 20,
        color: "#ef4444",
        fontWeight: "bold",
    },
    productDescription: {
        fontSize: 16,
        color: "#4b5563",
        marginVertical: 10,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    productStar: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 5,
    },
});

export default ProductDetailScreen;
