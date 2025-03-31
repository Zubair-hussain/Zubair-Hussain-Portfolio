import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-6 mt-16">
      {/* WhatsApp Call to Action */}
      <div className="mb-4">
        <p className="text-lg text-gray-300 mb-2">
          Have a project in mind? Let’s discuss and make it a reality! 🚀
        </p>
        <a
          href="https://wa.me/923708729117"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all hover:bg-orange-600 hover:scale-105"
        >
          💬 Let's Chat on WhatsApp
        </a>
      </div>

      {/* Copyright Text */}
      <p className="text-gray-400">© 2025 My Portfolio. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
