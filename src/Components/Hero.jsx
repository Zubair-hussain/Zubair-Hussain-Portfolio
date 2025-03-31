import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import ResumeFile from "../assets/Picsart_25-03-21_18-04-10-868.png"; // ✅ Correct Resume Path

const HeroSection = () => {
  return (
    <section id="Home" className="flex flex-col items-center text-center py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Hi, I'm <span className="text-blue-600">Zubair Hussain</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          A passionate <strong>Full-Stack Developer</strong> dedicated to building high-quality, scalable web applications. I specialize in crafting intuitive user experiences and robust backend solutions that bring ideas to life.
        </p>
        <div className="flex gap-6 mt-6 flex-row justify-center">
          <motion.a
            whileHover={{ scale: 1.1 }}
            href={`mailto:detroonshah@gmail.com?subject=Hey, I'm interested in your work!&body=Hey Zubair,%0D%0A%0D%0AI came across your portfolio and I'm really impressed!%0D%0A%0D%0AI would like to discuss a project with you. Here are some details:%0D%0A- **Project Description:** [Describe here]%0D%0A- **Time Period:** [Specify here]%0D%0A- **Your Pricing/Demand?**%0D%0A%0D%0ALooking forward to your response!%0D%0A%0D%0AThanks!`}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition shadow-lg"
          >
            Contact Me
          </motion.a>
          {/* ✅ Keeps all styles & animations ✅ */}
          <motion.a
            whileHover={{ scale: 1.1 }}
            href={ResumeFile}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition shadow-lg flex items-center gap-2"
          >
            View Resume <FaDownload />
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
