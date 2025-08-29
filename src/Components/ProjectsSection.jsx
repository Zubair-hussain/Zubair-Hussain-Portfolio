import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaReact, 
  FaMobileAlt, 
  FaPython, 
  FaHtml5, 
  FaCode, 
  FaCopy, 
  FaEdit,
  FaRobot,
  FaUser,
  FaTrash
} from "react-icons/fa";

/**
 * NOTE: In your .env file, make sure you have:
 * VITE_BACKEND_URL=https://backend-ai-smoky.vercel.app
 * (no quotes)
 */

const projects = [
  {
    title: "Animated Personal Portfolio",
    description: "A modern portfolio prototype with React, GSAP, Locomotive Scroll, and EmailJS, featuring smooth animations and a responsive design.",
    link: "https://zubair-hussain.github.io/Zubair-Hussain-Portfolio/",
    categories: ["React"],
    image: "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Portfolio"
  },
  {
    title: "React First Project",
    description: "My first React (v18) app showcasing fundamental concepts and modern development practices.",
    link: "https://github.com/Zubair-Hussain/React-f-project",
    categories: ["React"],
    image: "https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=React+App"
  },
  {
    title: "Interactive Form App",
    description: "Interactive form application with validation, real-time feedback, and smooth user experience.",
    link: "https://github.com/Zubair-Hussain/Form-React",
    categories: ["React"],
    image: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Form+App"
  },
  {
    title: "Dynamic React + Vite App",
    description: "High-performance React application built with Vite for lightning-fast development and optimization.",
    link: "https://github.com/Zubair-Hussain/React-dynamic-project",
    categories: ["React"],
    image: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Vite+App"
  },
  {
    title: "Movie Discovery App",
    description: "Feature-rich movie application with search, filters, and detailed movie information display.",
    link: "https://github.com/Zubair-Hussain/Movie-App",
    categories: ["React"],
    image: "https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Movie+App"
  },
  {
    title: "Mobile App Project",
    description: "Cross-platform mobile application with native performance and intuitive user interface design.",
    link: "https://github.com/Zubair-Hussain/Mobile-App",
    categories: ["React Native"],
    image: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Mobile+App"
  },
  {
    title: "ExploreItAI Recommendation System",
    description: "Advanced ML recommendation engine using collaborative filtering and content-based algorithms for personalized suggestions.",
    link: "https://github.com/Zubair-Hussain/Backend-Ai--Model-",
    categories: ["Python AI/ML"],
    image: "https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=AI+Recommend"
  },
  {
    title: "Text to Image Generator",
    description: "State-of-the-art AI image generation tool leveraging Stable Diffusion for creative visual content creation.",
    link: "https://github.com/Zubair-Hussain/Text-To-Image-",
    categories: ["Python AI/ML"],
    image: "https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Text2Image"
  },
  {
    title: "Salary Prediction Model",
    description: "Machine learning model for accurate salary predictions using multiple regression techniques and feature engineering.",
    link: "https://github.com/Zubair-Hussain/Salary-Prediction-using-Traditional-ML-Techniques",
    categories: ["Python AI/ML"],
    image: "https://via.placeholder.com/300x200/059669/FFFFFF?text=ML+Model"
  },
  {
    title: "Fake News Detection",
    description: "NLP-powered fake news classifier using advanced text processing and ensemble learning methods.",
    link: "https://github.com/Zubair-Hussain/Fake-News-Detection-using-NLP",
    categories: ["Python AI/ML"],
    image: "https://via.placeholder.com/300x200/DC2626/FFFFFF?text=News+AI"
  },
  {
    title: "Personal Portfolio Website",
    description: "Responsive portfolio website built with modern HTML5, CSS3, and JavaScript best practices.",
    link: "https://github.com/Zubair-Hussain/Potfolio-",
    categories: ["HTML/CSS"],
    image: "https://via.placeholder.com/300x200/F97316/FFFFFF?text=HTML+Portfolio"
  }
];

const categories = [
  { 
    name: "React", 
    icon: <FaReact className="text-blue-500 text-3xl" />,
    color: "from-blue-500 to-cyan-500",
    count: projects.filter(p => p.categories.includes("React")).length
  },
  { 
    name: "React Native", 
    icon: <FaMobileAlt className="text-green-500 text-3xl" />,
    color: "from-green-500 to-emerald-500",
    count: projects.filter(p => p.categories.includes("React Native")).length
  },
  { 
    name: "Python AI/ML", 
    icon: <FaPython className="text-purple-500 text-3xl" />,
    color: "from-purple-500 to-violet-500",
    count: projects.filter(p => p.categories.includes("Python AI/ML")).length
  },
  { 
    name: "HTML/CSS", 
    icon: <FaHtml5 className="text-orange-500 text-3xl" />,
    color: "from-orange-500 to-red-500",
    count: projects.filter(p => p.categories.includes("HTML/CSS")).length
  }
];

const MAX_MESSAGE_LENGTH = 500;

const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // ✅ Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ Initialize chat position (runs once on mount)
  useEffect(() => {
    setChatPosition({
      x: window.innerWidth - 400, // ~16px margin from right given 384px width
      y: 100 // Below navbar
    });
  }, []);

  // Parse response to extract code blocks and clean thinking tags
  const parseResponse = (text) => {
    // Remove thinking/info tags and their content
    let cleanedText = text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
    cleanedText = cleanedText.replace(/<info>[\s\S]*?<\/info>/gi, '');
    
    const codeRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    while ((match = codeRegex.exec(cleanedText))) {
      const [, language, code] = match;
      if (match.index > lastIndex) {
        const textContent = cleanedText.slice(lastIndex, match.index).trim();
        if (textContent) {
          parts.push({ type: "text", content: textContent });
        }
      }
      parts.push({ type: "code", language: language || "javascript", content: code.trim() });
      lastIndex = codeRegex.lastIndex;
    }

    if (lastIndex < cleanedText.length) {
      const remainingText = cleanedText.slice(lastIndex).trim();
      if (remainingText) {
        parts.push({ type: "text", content: remainingText });
      }
    }

    return parts.filter((part) => part.content);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const getProjectsByCategory = (category) => {
    return projects.filter((project) => project.categories.includes(category));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskAI();
    }
  };

  const handleAskAI = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput, history: newMessages }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.reply || data.response || "No response received",
          parsed_content: parseResponse(data.reply || data.response || "No response received"),
        },
      ]);
    } catch (err) {
      console.error("API Error:", err);
      setMessages([
        ...newMessages,
        { 
          role: "assistant", 
          content: `Sorry, I'm having trouble connecting to my AI model. Please try again later. Error: ${err.message}`, 
          parsed_content: [{ type: "text", content: `Sorry, I'm having trouble connecting to my AI model. Please try again later. Error: ${err.message}` }]
        },
      ]);
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Drag functionality for chat window
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Boundary checks to keep chat window within viewport
    const maxX = window.innerWidth - 384; // 384px is chat width (w-96)
    const maxY = window.innerHeight - 500; // Approximate chat height
    
    setChatPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove global mouse event listeners during drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const CodeBlock = ({ language, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      copyToClipboard(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative group">
        <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 rounded-t-lg">
          <span className="text-xs font-medium">{language}</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              title="Copy code"
            >
              <FaCopy className="text-xs" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              title="Edit code"
            >
              <FaEdit className="text-xs" />
              Edit
            </button>
          </div>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm font-mono leading-relaxed">
          <code>{content}</code>
        </pre>
      </div>
    );
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative px-6 py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen"
    >
      <motion.div
        className="relative z-10 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            My <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore my diverse portfolio of web applications, mobile apps, and AI/ML projects
          </p>
        </motion.div>

        {/* Category Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === cat.name
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {cat.icon}
              {cat.name} ({cat.count})
            </button>
          ))}
        </motion.div>

        {/* Projects Grid - Only show when category is selected */}
        {selectedCategory && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {getProjectsByCategory(selectedCategory).map((project, index) => (
                <motion.div
                  key={project.title}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.categories.map((category, i) => {
                        const cat = categories.find(c => c.name === category);
                        return (
                          <span
                            key={i}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${cat?.color} text-white`}
                          >
                            {category === "React" && <FaReact />}
                            {category === "React Native" && <FaMobileAlt />}
                            {category === "Python AI/ML" && <FaPython />}
                            {category === "HTML/CSS" && <FaHtml5 />}
                            {category}
                          </span>
                        );
                      })}
                    </div>
                    
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaCode />
                      View Project
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state when no category is selected */}
        {!selectedCategory && (
          <motion.div
            className="text-center py-20 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FaCode className="text-6xl text-white/30 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Choose a Technology</h3>
            <p className="text-gray-300 text-lg">
              Select a category above to explore my projects in that technology
            </p>
          </motion.div>
        )}

        {/* AI Assistant Toggle */}
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <button
            onClick={() => setShowChat(!showChat)}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center text-white text-2xl"
          >
            <FaRobot />
          </button>
        </motion.div>

        {/* AI Assistant Chat */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              className="fixed bg-white rounded-2xl shadow-2xl z-40 overflow-hidden select-none"
              style={{
                left: chatPosition.x,
                top: chatPosition.y,
                width: '384px',
                cursor: isDragging ? 'grabbing' : 'default'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 20 }}
            >
              {/* Draggable Chat Header */}
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaRobot className="text-2xl" />
                    <div>
                      <h3 className="font-bold">AI Assistant</h3>
                      <p className="text-xs opacity-90">Drag me around! Ask about projects & code</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-white/80 hover:text-white transition-colors p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div
                ref={chatContainerRef}
                className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-4"
              >
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <FaRobot className="text-4xl mx-auto mb-4 text-gray-300" />
                    <p>Start a conversation with the AI assistant!</p>
                    <div className="text-xs mt-2 space-y-1">
                      <p>Try asking:</p>
                      <p>"Tell me about the React projects"</p>
                      <p>"Show me some Python code"</p>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.role === "user" 
                            ? "bg-blue-500 text-white" 
                            : "bg-purple-500 text-white"
                        }`}>
                          {msg.role === "user" ? <FaUser className="text-xs" /> : <FaRobot className="text-xs" />}
                        </div>
                        
                        <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                          msg.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800 border"
                        }`}>
                          {msg.role === "assistant" && msg.parsed_content ? (
                            <div className="space-y-3">
                              {msg.parsed_content.map((part, partIndex) => (
                                <div key={partIndex}>
                                  {part.type === "text" && (
                                    <p className="text-sm leading-relaxed">{part.content}</p>
                                  )}
                                  {part.type === "code" && (
                                    <CodeBlock language={part.language} content={part.content} />
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm">{msg.content}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                        <FaRobot className="text-white text-xs" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-white border shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t">
                <div className="flex gap-2 mb-2">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me about projects, code examples, or anything else..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm"
                    rows={2}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {userInput.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                  <div className="flex gap-2">
                    {messages.length > 0 && (
                      <button
                        onClick={clearChat}
                        className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                      >
                        <FaTrash className="text-xs" />
                        Clear
                      </button>
                    )}
                    <button
                      onClick={handleAskAI}
                      disabled={isLoading || !userInput.trim()}
                      className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium disabled:opacity-50 hover:from-blue-600 hover:to-purple-600 transition-all text-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          className="text-center mt-16 p-8 bg-white/5 backdrop-blur-lg rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-gray-300 text-lg leading-relaxed">
            I'm a{" "}
            <a
              href="https://github.com/Zubair-Hussain"
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              passionate full-stack developer
            </a>{" "}
            specializing in creating innovative web applications, mobile solutions, and AI-powered systems.
            Let's build something amazing together!
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
