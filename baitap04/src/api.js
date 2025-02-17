import axios from "axios";

export const API_URL = "https://e3b1-2402-800-6f2c-86fe-992b-bcef-ab4c-1478.ngrok-free.app/api";

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

// Update the fetchUserProfile function to properly use the email parameter
export const fetchUserProfile = async (email) => {
    try {
        if (!email) {
            console.warn("No email provided to fetchUserProfile");
            return null;
        }

        // Encode email to handle special characters in URL
        const encodedEmail = encodeURIComponent(email.trim());
        const url = `${API_URL}/users/profile?email=${encodedEmail}`;
        
        console.log("Fetching profile from:", url);
        const response = await axios.get(url);

        if (response.status === 200) {
            return response.data; // Contains the sanitized user object
        }

        return null;
    } catch (error) {
        if (error.response) {
            // Handle specific HTTP error codes
            switch (error.response.status) {
                case 400:
                    console.error("Invalid email provided");
                    break;
                case 404:
                    console.error("User not found");
                    break;
                case 500:
                    console.error("Server error:", error.response.data);
                    break;
                default:
                    console.error("Error fetching user profile:", error.response.data);
            }
        } else {
            console.error("Network error:", error.message);
        }
        return null;
    }
};

// Add a new function to fetch products with pagination
export const fetchProductsWithPagination = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(`${API_URL}/products?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};