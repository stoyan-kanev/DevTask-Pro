import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginComponent from "./components/LoginComponent/LoginComponent.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import RegisterComponent from "./components/RegisterComponent/RegisterComponent.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <AuthProvider>
              <Routes>
                  <Route path="/" element={<App/>} />
                  <Route path="/login" element={<LoginComponent/>} />
                  <Route path="/register" element={<RegisterComponent/>} />
              </Routes>
          </AuthProvider>

      </BrowserRouter>

  </StrictMode>,
)
