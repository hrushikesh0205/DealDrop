import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/authContext.jsx'
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TooltipProvider>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "14px 16px",
            fontSize: "14px",
          },

          success: {
            iconTheme: {
              primary: "#38bdf8",
              secondary: "#0f172a",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#0f172a",
            },
          },
        }}
      />

      <AuthProvider>
        <App />
      </AuthProvider>

    </TooltipProvider>
  </StrictMode>
)