// src/pages/PublicContactsPage.jsx
import React from "react";
import PublicContactsPageMobile from "./PublicContactsPageMobile";
import PublicContactsPageDesktop from "./PublicContactsPageDesktop";
const API = import.meta.env.VITE_API_BASE_URL;

function PublicContactsPage() {
  return (
    <>
      <PublicContactsPageMobile apiBase={API} />
      <PublicContactsPageDesktop apiBase={API} />
    </>
  );
}

// Static flag to signal MainLayout to hide its footer
PublicContactsPage.hideFooter = true;

export default PublicContactsPage;
