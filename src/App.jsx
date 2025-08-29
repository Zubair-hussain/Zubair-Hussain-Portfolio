import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "./page/SplashScreen";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import HeroSection from "./Components/Hero";
import ProjectsSection from "./Components/ProjectsSection";
import ClientComments from "./Components/ClientComments";
import Qualifications from "./Components/Qualifications";
import ErrorBoundary from "./Components/ErrorBoundary";

const ContactPage = lazy(() => import("./Components/ContactPage"));

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-blue-100">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ProjectsSection />
        <ErrorBoundary>
          <ClientComments />
        </ErrorBoundary>
      </main>
      <Qualifications />
      <Footer />
    </div>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  // SessionStorage is commented out for development to ensure splash screen shows on every refresh
  /*
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem("hasSeenSplash", "true");
    }
  }, []);
  */

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <ErrorBoundary>
      <Router>
        <AnimatePresence>
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        </AnimatePresence>
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/qualifications" element={<Qualifications />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;