const apiBase = import.meta.env.VITE_API_BASE_URL;

// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";

// Public pages
import ProductsPage from "./pages/ProductsPage";
import ServicesPage from "./pages/ServicePage";
import QuotePage from "./pages/QuotePage";
import PublicProjectsPage from "./pages/PublicProjectsPage";
import PublicProjectDetail from "./pages/PublicProjectDetail";
import PublicContactsPage from "./pages/PublicContactsPage";
import AboutPage from "./pages/AboutPage.jsx";
import QuoteInfoPage from "./pages/QuoteInfoPage";
import ThankYouPage from "./pages/ThankYouPage";
import ProductDetailPage from "./pages/ProductDetailPage";

// Admin pages & components
import AdminGate from "./components/AdminGate.jsx";
import Login from "./pages/admin/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/Products";
import ServicesAdmin from "./pages/admin/ServicesPage";
import ProjectsAdmin from "./pages/admin/ProjectsPage";
import ContactsPage from "./pages/admin/ContactsPage";
import AboutPageAdmin from "./pages/admin/AboutPage.jsx";
import AboutInfo from "./components/admin/AboutInfo";
import ClientsPanel from "./components/admin/ClientsPanel";
import TestimonialsPanel from "./components/admin/TestimonialsPanel";
import BrandsPanel from "./components/admin/BrandsPanel";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={<ProductsPage apiBase={apiBase} />}
          />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/request-quote" element={<QuotePage />} />
          <Route path="/projects" element={<PublicProjectsPage />} />
          <Route path="/projects/:id" element={<PublicProjectDetail />} />
          <Route path="/contacts" element={<PublicContactsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/quote-info" element={<QuoteInfoPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route
            path="/products/:slug"
            element={<ProductDetailPage apiBase={apiBase} />}
          />

          {/* Admin login (IP-allowlist only) */}
          <Route
            path="/admin/login"
            element={
              <AdminGate>
                <Login />
              </AdminGate>
            }
          />

          {/* All other /admin/* routes (IP + auth) */}
          <Route
            path="/admin/*"
            element={
              <AdminGate>
                {token ? (
                  <AdminLayout />
                ) : (
                  <Navigate to="/admin/login" replace />
                )}
              </AdminGate>
            }
          >
            {/* redirect /admin → /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="about" element={<AboutPageAdmin />}>
              <Route index element={<AboutInfo />} />
              <Route path="clients" element={<ClientsPanel />} />
              <Route path="testimonials" element={<TestimonialsPanel />} />
              <Route path="brands" element={<BrandsPanel />} />
            </Route>
          </Route>

          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;
