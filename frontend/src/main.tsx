import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginComponent from "./components/LoginComponent/LoginComponent.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import RegisterComponent from "./components/RegisterComponent/RegisterComponent.tsx";
import NavBarComponent from "./components/NavBarComponent/NavBarComponent.tsx";
import HomeComponent from "./components/HomeComponent/HomeComponent.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <AuthProvider>
              <NavBarComponent/>
              <Routes>
                  <Route path="/" element={<HomeComponent/>} />
                  <Route path="/project/:projectId" element={<HomeComponent />} />
                  <Route path="/login" element={<LoginComponent/>} />
                  <Route path="/register" element={<RegisterComponent/>} />
              </Routes>
          </AuthProvider>

      </BrowserRouter>

  </StrictMode>,
)
