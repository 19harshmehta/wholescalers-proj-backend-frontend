const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = {
  // Authentication
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: 'wholesaler' | 'retailer';
    company?: string;
    phone?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Wholesaler APIs
  wholesaler: {
    createProduct: async (token: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    getProducts: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.json();
    },

    getOrders: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.json();
    },

    updateOrderStatus: async (token: string, orderId: string, status: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      return response.json();
    },

    createInvoice: async (token: string, orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/invoices/order/${orderId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.json();
    },

    getDashboard: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/dashboard/overview`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.json();
    },

    getReport: async (token: string, reportType: 'sales' | 'inventory' | 'customers', startDate?: string, endDate?: string) => {
      let url = `${API_BASE_URL}/reports/export?reportType=${reportType}`;
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.text();
    },

    downloadInvoicePDF: async (token: string, invoiceId: string) => {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.blob();
    },
  },

  // Retailer APIs
  retailer: {
    getProducts: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.json();
    },

    createOrder: async (token: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    getOrders: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.json();
    },

    getInvoices: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.json();
    },

    getDashboard: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/retailerDashboard/overview`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.json();
    },
  },

  // Payment APIs
  payments: {
    createPaymentIntent: async (token: string, invoiceId: string) => {
      const response = await fetch(`${API_BASE_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ invoiceId }),
      });
      return response.json();
    },

    verifyPayment: async (token: string, paymentData: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/payments/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });
      return response.json();
    },
  },
};
