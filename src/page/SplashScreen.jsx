import React, { useEffect } from "react";
import { motion } from "framer-motion";

const SplashScreen = ({ onComplete }) => {
  const message = "Full Stack Innovation Awaits";
  const characters = message.split("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.5 } },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-500 z-[1000]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="text-center">
        <motion.h1 className="text-4xl md:text-6xl font-extrabold text-white px-4">
          {characters.map((char, index) => (
            <motion.span
              key={index}
              variants={charVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
      </div>
    </motion.div>
  );
};

export default SplashScreen;