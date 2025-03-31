import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Head";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import HeroSection from "./Components/Hero";
import ProjectsSection from "./Components/ProjectsSection";
import WorkWithMe from "./Components/WorkWithMe";
import ClientComments from "./Components/ClientComments";
import NewIdeaForm from "./Components/NewIdeaForm";
import Contact from "./Components/Contact";
import Qualifications from "./Components/Qualifications"; // ✅ Added Qualifications route

// Main layout (Excludes New Idea Form)
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        <HeroSection />
        <ProjectsSection />
        <ClientComments />
        <Contact />
      </main>

 
      <Footer />
    </div>
  );
};

// App Component with Routing
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main Layout Route */}
        <Route path="/" element={<MainLayout />} />

        {/* New Idea Form (Separate Route) */}
        <Route path="/new-idea-form" element={<NewIdeaForm />} />

        {/* Qualifications Page Route ✅ */}
        <Route path="/qualifications" element={<Qualifications />} />
      </Routes>
    </Router>
  );
};

export default App;
