const API_BASE_URL = 'http://localhost:5000/api';

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      imageUrl: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Helper function to get the authentication token from localStorage.
 * @returns {string | null} The JWT token or null if not found.
 */
const getToken = (): string | null => {
  return localStorage.getItem('userToken');
};

/**
 * Fetches user's orders.
 * @returns {Promise<Order[]>} A promise that resolves with the user's orders.
 * @throws {Error} If the fetch request fails or the response indicates an error.
 */
export const getUserOrders = async (): Promise<Order[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders.');
    }

    return data.orders || data || [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Fetches a specific order by ID.
 * @param {string} orderId The order ID to fetch.
 * @returns {Promise<Order>} A promise that resolves with the order details.
 * @throws {Error} If the fetch request fails or the response indicates an error.
 */
export const getOrderById = async (orderId: string): Promise<Order> => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order details.');
    }

    return data.order || data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

/**
 * Fetches recent user orders with a limit.
 * @param {number} limit The maximum number of orders to return.
 * @returns {Promise<Order[]>} A promise that resolves with the user's recent orders.
 * @throws {Error} If the fetch request fails or the response indicates an error.
 */
export const getRecentOrders = async (limit: number = 5): Promise<Order[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch recent orders.');
    }

    return data.orders || data || [];
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};