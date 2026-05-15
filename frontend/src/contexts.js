
// ============================================
// ZAHOOR FLOUR MILLS — ALL CONTEXTS (Cart, Auth, Product)
// ============================================

import React, { createContext, useContext, useReducer, useState, useEffect, useCallback, useMemo } from 'react';
import { apiUrl, docId } from './config';

// ===================== CART CONTEXT =====================
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const idx = state.items.findIndex(i => i._id === action.payload._id && i.selectedWeight === action.payload.selectedWeight);
      if (idx >= 0) {
        const updated = [...state.items];
        updated[idx].quantity += action.payload.quantity || 1;
        return { ...state, items: updated };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i._id === action.payload._id && i.selectedWeight === action.payload.selectedWeight)
        ),
      };
    case 'UPDATE_QUANTITY': {
      const updated = state.items.map(i =>
        (i._id === action.payload._id && i.selectedWeight === action.payload.selectedWeight)
          ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
      );
      return { ...state, items: updated };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: JSON.parse(localStorage.getItem('zfm_cart') || '[]'),
  });

  useEffect(() => {
    localStorage.setItem('zfm_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product });
  const removeFromCart = (_id, selectedWeight) => dispatch({ type: 'REMOVE_FROM_CART', payload: { _id, selectedWeight } });
  const updateQuantity = (_id, selectedWeight, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { _id, selectedWeight, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems: state.items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

// ===================== AUTH CONTEXT =====================
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('zfm_admin_token') || null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const raw = localStorage.getItem('zfm_admin_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  /** Store dashboard / admin API: only after admin-panel login (JWT + user with admin role). */
  const isAdmin = Boolean(
    adminToken &&
    adminUser &&
    String(adminUser.role || '').toLowerCase() === 'admin'
  );

  useEffect(() => {
    const savedUser = localStorage.getItem('zfm_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser({ ...u, id: docId(u) });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const normalized = { ...userData, id: docId(userData) };
    setUser(normalized);
    localStorage.setItem('zfm_user', JSON.stringify(normalized));
  };

  /** Call after successful POST /api/auth/admin/login */
  const adminLogin = ({ token, user: adminData }) => {
    const normalized = { ...adminData, id: docId(adminData) };
    setAdminToken(token);
    setAdminUser(normalized);
    localStorage.setItem('zfm_admin_token', token);
    localStorage.setItem('zfm_admin_user', JSON.stringify(normalized));
    localStorage.removeItem('zfm_admin');
  };

  const logout = () => {
    setUser(null);
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('zfm_user');
    localStorage.removeItem('zfm_admin');
    localStorage.removeItem('zfm_admin_token');
    localStorage.removeItem('zfm_admin_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      adminToken,
      adminUser,
      isAdmin,
      loading,
      login,
      adminLogin,
      logout,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// ===================== PRODUCT CONTEXT =====================
const ProductContext = createContext();

const withClientId = (doc) => (doc ? { ...doc, id: docId(doc) } : doc);

const pickProductPayload = (p) => ({
  name: p.name,
  price: Number(p.price),
  description: p.description,
  category: p.category,
  image: p.image,
  weights: Array.isArray(p.weights) ? p.weights : [],
  featured: Boolean(p.featured),
  inStock: p.inStock !== false,
  rating: p.rating != null ? Number(p.rating) : 0,
  reviews: p.reviews != null ? Number(p.reviews) : 0,
});

const pickOrderPayload = (o) => ({
  fullName: o.fullName,
  phone: o.phone,
  address: o.address,
  city: o.city,
  paymentMethod: o.paymentMethod,
  notes: o.notes,
  items: o.items,
  subtotal: o.subtotal,
  delivery: o.delivery,
  total: o.total,
  status: o.status || (o.paymentStatus === 'paid' ? 'Processing' : 'Pending'),
  stripePaymentIntentId: o.stripePaymentIntentId,
  paymentStatus: o.paymentStatus != null ? o.paymentStatus : 'pending',
});

async function parseApiJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

export const ProductProvider = ({ children }) => {
  const { adminToken } = useAuth();

  const adminHeaders = useMemo(
    () => ({
      'Content-Type': 'application/json',
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
    }),
    [adminToken]
  );

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [contacts, setContacts] = useState([]);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/products'));
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data.map((p) => withClientId(p)));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  const refreshOrdersInquiriesContacts = useCallback(async () => {
    if (!adminToken) {
      setOrders([]);
      setInquiries([]);
      setContacts([]);
      return;
    }
    try {
      const [orRes, inqRes, conRes] = await Promise.all([
        fetch(apiUrl('/api/orders'), { headers: adminHeaders }),
        fetch(apiUrl('/api/inquiries'), { headers: adminHeaders }),
        fetch(apiUrl('/api/contacts'), { headers: adminHeaders }),
      ]);
      const [or, inq, con] = await Promise.all([orRes.json(), inqRes.json(), conRes.json()]);
      if (orRes.ok && Array.isArray(or)) setOrders(or.map((o) => withClientId(o)));
      else setOrders([]);
      if (inqRes.ok && Array.isArray(inq)) setInquiries(inq.map((i) => withClientId(i)));
      else setInquiries([]);
      if (conRes.ok && Array.isArray(con)) setContacts(con.map((c) => withClientId(c)));
      else setContacts([]);
    } catch (error) {
      console.error('Error fetching orders/inquiries/contacts:', error);
    }
  }, [adminToken, adminHeaders]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    refreshOrdersInquiriesContacts();
  }, [refreshOrdersInquiriesContacts]);

  const addProduct = async (p) => {
    const res = await fetch(apiUrl('/api/products'), {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify(pickProductPayload(p)),
    });
    const created = await parseApiJson(res);
    setProducts((prev) => [...prev, withClientId(created)]);
  };

  const updateProduct = async (id, data) => {
    const mongoId = String(id);
    const res = await fetch(apiUrl(`/api/products/${mongoId}`), {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify(pickProductPayload({ ...data, price: data.price })),
    });
    const updated = await parseApiJson(res);
    setProducts((prev) => prev.map((p) => (docId(p) === mongoId ? withClientId(updated) : p)));
  };

  const deleteProduct = async (id) => {
    const mongoId = String(id);
    const res = await fetch(apiUrl(`/api/products/${mongoId}`), { method: 'DELETE', headers: adminHeaders });
    await parseApiJson(res);
    setProducts((prev) => prev.filter((p) => docId(p) !== mongoId));
  };

  const addOrder = async (order) => {
    const body = pickOrderPayload(order);
    const res = await fetch(apiUrl('/api/orders'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const created = await parseApiJson(res);
    const normalized = withClientId(created);
    setOrders((prev) => [...prev, normalized]);
    return normalized;
  };

  const updateOrderStatus = async (id, status) => {
    const mongoId = String(id);
    const existing = orders.find((o) => docId(o) === mongoId);
    if (!existing) return;
    const body = pickOrderPayload({ ...existing, status });
    const res = await fetch(apiUrl(`/api/orders/${mongoId}`), {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify(body),
    });
    const updated = await parseApiJson(res);
    setOrders((prev) => prev.map((o) => (docId(o) === mongoId ? withClientId(updated) : o)));
  };

  const deleteOrder = async (id) => {
    const mongoId = String(id);
    const res = await fetch(apiUrl(`/api/orders/${mongoId}`), { method: 'DELETE', headers: adminHeaders });
    await parseApiJson(res);
    setOrders((prev) => prev.filter((o) => docId(o) !== mongoId));
  };

  const addInquiry = async (inq) => {
    const res = await fetch(apiUrl('/api/inquiries'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inq),
    });
    const created = await parseApiJson(res);
    setInquiries((prev) => [...prev, withClientId(created)]);
  };

  const markInquiryRead = async (id) => {
    const mongoId = String(id);
    const res = await fetch(apiUrl(`/api/inquiries/${mongoId}`), {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({ isRead: true }),
    });
    const updated = await parseApiJson(res);
    setInquiries((prev) => prev.map((i) => (docId(i) === mongoId ? withClientId(updated) : i)));
  };

  const deleteInquiry = async (id) => {
    const mongoId = String(id);
    const res = await fetch(apiUrl(`/api/inquiries/${mongoId}`), { method: 'DELETE', headers: adminHeaders });
    await parseApiJson(res);
    setInquiries((prev) => prev.filter((i) => docId(i) !== mongoId));
  };

  const addContact = async (contact) => {
    const res = await fetch(apiUrl('/api/contacts'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    const created = await parseApiJson(res);
    setContacts((prev) => [...prev, withClientId(created)]);
  };

  const updateContact = async (id, body) => {
    const mongoId = String(id);
    const res = await fetch(apiUrl(`/api/contacts/${mongoId}`), {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify(body),
    });
    const updated = await parseApiJson(res);
    setContacts((prev) => prev.map((c) => (docId(c) === mongoId ? withClientId(updated) : c)));
  };

  const deleteContact = async (id) => {
    const mongoId = String(id);
    const res = await fetch(apiUrl(`/api/contacts/${mongoId}`), { method: 'DELETE', headers: adminHeaders });
    await parseApiJson(res);
    setContacts((prev) => prev.filter((c) => docId(c) !== mongoId));
  };

  const updateInquiry = async (id, body) => {
    const mongoId = String(id);
    const res = await fetch(apiUrl(`/api/inquiries/${mongoId}`), {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify(body),
    });
    const updated = await parseApiJson(res);
    setInquiries((prev) => prev.map((i) => (docId(i) === mongoId ? withClientId(updated) : i)));
  };

  const updateOrder = async (id, partial) => {
    const mongoId = String(id);
    const existing = orders.find((o) => docId(o) === mongoId);
    if (!existing) return;
    const body = pickOrderPayload({ ...existing, ...partial });
    const res = await fetch(apiUrl(`/api/orders/${mongoId}`), {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify(body),
    });
    const updated = await parseApiJson(res);
    setOrders((prev) => prev.map((o) => (docId(o) === mongoId ? withClientId(updated) : o)));
  };

  const addReview = async (payload) => {
    const res = await fetch(apiUrl('/api/reviews'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await parseApiJson(res);
    await refreshProducts();
  };

  const updateReview = async (id, patch) => {
    const res = await fetch(apiUrl(`/api/reviews/${id}`), {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify(patch),
    });
    await parseApiJson(res);
    await refreshProducts();
  };

  const deleteReview = async (id) => {
    const res = await fetch(apiUrl(`/api/reviews/${id}`), { method: 'DELETE', headers: adminHeaders });
    await parseApiJson(res);
    await refreshProducts();
  };

  const updateUser = async (id, body) => {
    const res = await fetch(apiUrl(`/api/users/${id}`), {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify(body),
    });
    return parseApiJson(res);
  };

  const deleteUser = async (id) => {
    const res = await fetch(apiUrl(`/api/users/${id}`), { method: 'DELETE', headers: adminHeaders });
    await parseApiJson(res);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        refreshOrdersInquiriesContacts,
        inquiries,
        addInquiry,
        markInquiryRead,
        deleteInquiry,
        contacts,
        addContact,
        updateContact,
        deleteContact,
        addReview,
        updateReview,
        deleteReview,
        updateInquiry,
        updateOrder,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
};

