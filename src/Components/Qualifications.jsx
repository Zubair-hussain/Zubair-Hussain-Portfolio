import React, { useState, useEffect } from "react";

const Qualifications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  return (
    <section
      className={`min-h-screen flex flex-col items-center justify-center bg-black text-white px-8 py-20 transition-all duration-1000 ${
        isVisible ? "justify-start pt-20" : "justify-center"
      }`}
    >
      {/* Heading and Description (Initially Centered) */}
      <div className={`text-center transition-all duration-1000 mt-15  ${isVisible ? "translate-y-0" : "translate-y-10"}`}>
        <h1 className="text-5xl font-bold text-orange-500 mb-6">My Qualifications</h1>

        <p className="text-lg text-gray-300 max-w-4xl mb-6 leading-relaxed">
          As a passionate <b>UI/UX Designer</b>, <b>AI Enthusiast</b>, and <b>Full Stack Developer</b>,  
          I am dedicated to crafting innovative digital experiences that blend creativity with technology.
        </p>

        {/* Button (Initially Centered) */}
        {!isVisible && (
          <button
            onClick={() => setIsVisible(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all hover:bg-orange-600 flex items-center ml-80 gap-2"
          >
            <span>See the Qualifications</span>
            <span className="animate-bounce">👇</span>
          </button>
        )}
      </div>

      {/* Academic Background Section */}
      <div
        className={`w-full max-w-2xl bg-gray-900 p-8 rounded-lg shadow-lg mt-12 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
        style={{ minHeight: "250px" }}
      >
        <h2 className="text-2xl font-bold text-orange-400 mb-4">Academic Background</h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          I hold a <b>Bachelor’s Degree in Information Technology (BSIT)</b> from  
          <span className="text-yellow-400 font-bold">  
            <a href="https://earth.google.com/earth/d/1a0FXGu-tdeAhjg3y2LCmmCw5OZ7x5cGa"  
               target="_blank"  
               rel="noopener noreferrer"  
               className="hover:underline">  
              Government College University Hyderabad (GCUH)
            </a>
          </span>.  
          My academic journey has equipped me with a strong foundation in <b>software development, problem-solving, and cutting-edge technologies</b>.  
        </p>
      </div>

      {/* Qualification Cards (Appears After Click) */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-8 transition-opacity duration-1000 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-orange-400 mb-2">UI/UX Design</h2>
          <p className="text-gray-300 mb-4 leading-relaxed">Certified in UI/UX Design Specialization.</p>
          <a
            href="https://coursera.org/share/e4045dec9faf0ccea89b292fecce206c"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            View Certificate
          </a>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-orange-400 mb-2">AI Essentials</h2>
          <p className="text-gray-300 mb-7 leading-relaxed">Completed AI Essentials Course.</p>
          <a
            href="https://www.coursera.org/account/accomplishments/verify/Z22Z9368CXK2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            View Certificate
          </a>
        </div>

        {/* Full Stack Developer Box with Loading Animation */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-orange-400 mb-2">Full Stack Developer</h2>

          {isLoading ? (
            <div className="animate-pulse">
              <div className="bg-gray-700 h-4 w-48 mx-auto mb-2 rounded"></div>
              <div className="bg-gray-700 h-4 w-32 mx-auto rounded"></div>
            </div>
          ) : (
            <p className="text-lg font-bold text-gray-500 animate-letter-fade">
              {
                "Certification Coming Soon...".split("").map((char, index) => (
                  <span key={index} style={{ animationDelay: `${index * 0.1}s` }} className="letter-animate">
                    {char}
                  </span>
                ))
              }
            </p>
          )}
        </div>
      </div>

      {/* WhatsApp Footer (Hidden Initially, Appears After Clicking Button) */}
      {isVisible && (
        <div className="mt-16 text-center transition-all duration-1000 opacity-100">
          <p className="text-lg text-gray-400">Let's connect and build something amazing together!</p>
          <div
            className="bg-orange-500 text-white px-6 py-4 rounded-lg mt-4 shadow-md text-center cursor-pointer transition-all hover:bg-orange-600 hover:scale-105 inline-block"
            onClick={() => window.open("https://wa.me/923708729117", "_blank")}
          >
            <p className="text-lg font-semibold">🚀 Have a project idea? Let's chat and make it happen!</p>
          </div>
        </div>
      )}

      {/* Minimalist Animation */}
      <style>
        {`
          @keyframes letter-fade {
            0% { color: gray; }
            50% { color: white; }
            100% { color: gray; }
          }

          .letter-animate {
            display: inline-block;
            animation: letter-fade 2s infinite ease-in-out;
          }
        `}
      </style>
    </section>
  );
};

export default Qualifications;
