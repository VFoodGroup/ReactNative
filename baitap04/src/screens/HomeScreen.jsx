import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { fetchCategories, fetchProducts, fetchProductsSorted, fetchUserProfile } from "../api";
import CategoryList from "../components/CategoryList";
import BestSellingList from "../components/BestSellingList";
import LazyLoadingList from "../components/LazyLoadingList";
import NavigationBar from "../components/NavigationBar";

const HomeScreen = ({ route, navigation }) => {
  const { email, userProfile: initialProfile } = route.params || {};
  const [categories, setCategories] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [userProfile, setUserProfile] = useState(initialProfile || null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  // Memoize the data loading function
  const loadData = useCallback(async () => {
    if (!email) {
      console.warn("No email provided to HomeScreen");
      navigation.replace("Login");
      return;
    }

    try {
      const [cats, products, profile] = await Promise.all(
        [
          fetchCategories(),
          fetchProducts(),
          !initialProfile ? fetchUserProfile(email) : null,
        ].filter(Boolean)
      );

      setCategories(cats || []);
      setBestSelling(products?.slice(0, 10) || []);

      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [email, initialProfile, navigation]);

  // Initial data load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  // Memoize the header component
  const ListHeader = useMemo(
    () => (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <TextInput
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <FontAwesome name="bell" size={24} color="#fff" />
          </TouchableOpacity>
          {userProfile?.avt ? (
            <Image source={{ uri: userProfile.avt }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <FontAwesome name="user" size={20} color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.sortContainer}>
          <Text style={styles.sortText}>Sắp xếp theo giá:</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              const newOrder = sortOrder === "asc" ? "desc" : "asc";
              setSortOrder(newOrder);
              loadData();
            }}
          >
            <Text style={styles.sortButtonText}>
              {sortOrder === "asc" ? "⬆ Tăng dần" : "⬇ Giảm dần"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <CategoryList categories={categories} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bán chạy nhất</Text>
          <BestSellingList products={bestSelling} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tất cả sản phẩm</Text>
        </View>
      </>
    ),
    [categories, bestSelling, userProfile, navigation, sortOrder]
  );

  // Memoize the LazyLoadingList render function
  const renderLazyList = useCallback(
    () => <LazyLoadingList fetchMore={fetchProducts} navigation={navigation} />,
    []
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={[{ key: "lazyList" }]}
        ListHeaderComponent={ListHeader}
        renderItem={renderLazyList}
        keyExtractor={(item) => item.key}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563eb"]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      <NavigationBar email={email} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 25,
    marginHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  slideShowContainer: {
    backgroundColor: "#ff6326",
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15,
    paddingVertical: 40,
    alignItems: "center",
  },
  slideShowText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
sortContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 15,
  marginVertical: 10,
},
sortText: {
  fontSize: 16,
  fontWeight: "bold",
},
sortButton: {
  backgroundColor: "#2563eb",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 5,
},
sortButtonText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "bold",
},
});
export default HomeScreen;
