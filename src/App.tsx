
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { useLanguageStore } from "./store/languageStore";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RxManager from "./pages/RxManager";

function App() {
  const { language, setLanguage } = useLanguageStore();
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    setDir(language === "ar" ? "rtl" : "ltr");
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div dir={dir} className={language === "ar" ? "font-cairo" : "font-inter"}>
        <Router>
          <Routes>
            <Route 
              path="/" 
              element={
                <Layout 
                  activeSection={activeSection} 
                  onNavigate={handleNavigate}
                >
                  <Index />
                </Layout>
              } 
            />
            <Route 
              path="/rx-manager" 
              element={
                <Layout 
                  activeSection={activeSection} 
                  onNavigate={handleNavigate}
                >
                  <RxManager />
                </Layout>
              } 
            />
            <Route 
              path="*" 
              element={
                <Layout 
                  activeSection={activeSection} 
                  onNavigate={handleNavigate}
                >
                  <NotFound />
                </Layout>
              } 
            />
          </Routes>
        </Router>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
