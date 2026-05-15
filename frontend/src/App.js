import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider, AuthProvider, ProductProvider } from './contexts';
import {
  ScrollToTop, Navbar, Footer, HomePage, AboutPage, ProductsPage,
  ProductDetailPage, CartPage, CheckoutPage, ContactPage, FAQPage,
  WheatSellerPage, SignInPage, SignUpPage, AdminLogin, AdminLayout,
  AdminDashboard, AdminProducts, AdminOrders, AdminInquiries, AdminUsers,
  AdminContacts, AdminReviews,
} from './components';

const MainLayout = ({ children }) => (<><Navbar />{children}<Footer /></>);

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
              <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
              <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
              <Route path="/products/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
              <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
              <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
              <Route path="/faq" element={<MainLayout><FAQPage /></MainLayout>} />
              <Route path="/wheat-seller" element={<MainLayout><WheatSellerPage /></MainLayout>} />
              <Route path="/signin" element={<MainLayout><SignInPage /></MainLayout>} />
              <Route path="/signup" element={<MainLayout><SignUpPage /></MainLayout>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
              <Route path="*" element={<MainLayout><div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', paddingTop:'140px' }}><h1>404</h1><p style={{ margin:'12px 0 24px' }}>Page not found</p><a href="/" className="btn btn-primary">Go Home</a></div></MainLayout>} />
            </Routes>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;