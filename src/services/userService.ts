
const API_BASE_URL = 'http://localhost:5000/api';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  cart: any[];
  wishlist: any[];
  orders: any[];
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  password?: string;
}

/**
 * Helper function to get the authentication token from localStorage.
 * @returns {string | null} The JWT token or null if not found.
 */
const getToken = (): string | null => {
  return localStorage.getItem('userToken');
};

/**
 * Fetches the logged-in user's profile.
 * @returns {Promise<UserProfile>} A promise that resolves with the user's profile data.
 * @throws {Error} If the fetch request fails or the response indicates an error.
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user profile.');
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Updates the logged-in user's profile.
 * @param {UpdateProfileData} profileData The data to update (e.g., { firstName: 'NewName', email: 'new@example.com' }).
 * @returns {Promise<UserProfile>} A promise that resolves with the updated user's profile data.
 * @throws {Error} If the fetch request fails or the response indicates an error.
 */
export const updateUserProfile = async (profileData: UpdateProfileData): Promise<UserProfile> => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user profile.');
    }

    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};