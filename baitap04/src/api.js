import axios from "axios";

export const API_URL = "https://2b9f-115-73-142-54.ngrok-free.app/api";

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchProducts = async (page = 1, limit = 10, searchQuery = "") => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: {
        page,
        limit,
        search: searchQuery, // Thêm từ khóa tìm kiếm
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/products/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const fetchUserProfile = async (email) => {
  try {
    if (!email) {
      console.warn("No email provided to fetchUserProfile");
      return null;
    }

    const encodedEmail = encodeURIComponent(email.trim());
    const url = `${API_URL}/users/profile?email=${encodedEmail}`;
    const response = await axios.get(url);

    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
export const fetchProductById = async (id) => {
  try {
      if (!id) {
          console.warn("fetchProductById: Missing product ID");
          return null;
      }

      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
  } catch (error) {
      console.error("Error fetching product details:", error.response?.data || error.message);
      return null;
  }
};
export const fetchProductsSorted = async (sortOrder = "asc") => {
  const url = `${API_URL}/products?sortBy=price&sortOrder=${sortOrder}`;
  console.log("Fetching products from:", url); // Kiểm tra API URL
  try {
      const response = await axios.get(url);
      return response.data;
  } catch (error) {
      console.error("Error fetching sorted products:", error.response?.data || error.message);
      return [];
  }
};
export const fetchProductsWithFilters = async ({ search, minPrice, maxPrice, sortOrder = "asc", page = 1, limit = 10 }) => {
  try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      params.append("sortBy", "price");
      params.append("sortOrder", sortOrder);
      params.append("page", page);
      params.append("limit", limit);

      const url = `${API_URL}/products?${params.toString()}`;
      console.log("Fetching products from:", url); // Kiểm tra URL API
      const response = await axios.get(url);
      return response.data;
  } catch (error) {
      console.error("Error fetching filtered products:", error);
      return { products: [], total: 0, totalPages: 0 };
  }
};


