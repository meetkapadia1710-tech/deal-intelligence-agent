import React from "react";
import ReactDOM from "react-dom/client";
import App from "app/App";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || "pk_test_YW11c2luZy1nbnUtMTIuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  console.warn("Missing Publishable Key. Please add REACT_APP_CLERK_PUBLISHABLE_KEY to your .env file");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY || "missing"}>
    <App />
  </ClerkProvider>
);
