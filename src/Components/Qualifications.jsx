import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, Stars, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import profile from '../assets/Profile-pic.jpg'; // Ensure this matches your renamed image file

// Extend R3F namespace to include TextGeometry
extend({ TextGeometry });

const Star = ({ onHover, onUnhover }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered); // Changes cursor to pointer when hovering

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
      if (hovered) {
        meshRef.current.scale.set(1.2, 1.2, 1.2); // Scale up on hover
        meshRef.current.material.emissive.set('#d8b4fe'); // Lighter purple on hover
      } else {
        meshRef.current.scale.set(1, 1, 1); // Reset scale
        meshRef.current.material.emissive.set('#a855f7'); // Default purple
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => { setHovered(true); onHover(); }}
      onPointerOut={() => { setHovered(false); onUnhover(); }}
    >
      <dodecahedronGeometry args={[1.2, 0]} />
      <meshStandardMaterial color="#ffffff" wireframe emissive="#a855f7" emissiveIntensity={0.5} />
      <pointLight position={[0, 0, 5]} intensity={2} color="#a855f7" />
    </mesh>
  );
};

const BackgroundStars = () => {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <ambientLight intensity={0.4} />
      <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade speed={0.5} color="#d8b4fe" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
    </Canvas>
  );
};

const CentralStar = () => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Canvas style={{ height: '200px', width: '200px' }} className="md:h-48 md:w-48 lg:h-56 lg:w-56 mx-auto sm:mx-auto">
      <ambientLight intensity={0.6} />
      <Star onHover={() => setHovered(true)} onUnhover={() => setHovered(false)} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      {hovered && (
        <mesh position={[0, 0, 0]}>
          <sprite>
            <spriteMaterial color="#ffffff" transparent opacity={0.7}>
              <canvasTexture attach="map" />
            </spriteMaterial>
            <textGeometry args={["Click to Explore", { size: 0.5, height: 0.1 }]} />
          </sprite>
        </mesh>
      )}
    </Canvas>
  );
};

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Background 3D Stars and Blobs */}
      <Suspense fallback={null}>
        <BackgroundStars />
      </Suspense>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 md:w-64 md:h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
        {/* Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Syed Zubair Hussain Shah
        </h2>

        {/* Central 3D Star with Interaction */}
        <div className="flex justify-center mb-6">
          <Suspense fallback={<div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center text-gray-400 text-sm">Loading 3D Showcase...</div>}>
            <CentralStar />
          </Suspense>
        </div>

        {/* Tagline */}
        <p className="text-lg md:text-xl font-semibold text-gray-200 text-center mb-6">
          Full Stack & Mobile App Developer | Data Analyst | AI Engineer
        </p>

        {/* Profile Photo with Error Fallback */}
        <div className="flex justify-center mb-6">
          <img
            src={profile}
            alt="Syed Zubair Hussain Shah"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-purple-500/50 shadow-md hover:shadow-purple-500/30 transition-shadow duration-300"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Profile'; }} // Fallback image
          />
        </div>

        {/* About Me */}
        <div className="mb-6 text-center">
          <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-2">About Me</h3>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">
            I’m a results-driven developer passionate about creating scalable products, seamless user experiences, and data-driven solutions. With an Information Technology undergraduate background, I specialize in frontend web development, cross-platform mobile apps, and AI/ML projects. Currently, I’m exploring AI-powered applications and optimizing system designs.
          </p>
        </div>

        {/* Career Goals - Card Layout */}
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-4 flex items-center justify-center gap-2">
            Career Goals
            <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-full text-purple-300">Vision</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner text-sm md:text-base text-gray-300">
              Build industry-grade AI-powered products
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner text-sm md:text-base text-gray-300">
              Contribute to open-source AI & web frameworks
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner text-sm md:text-base text-gray-300">
              Work in a global tech environment solving real-world challenges
            </div>
          </div>
        </div>

        {/* Featured Projects - Table Style */}
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-4">Featured Projects</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base text-gray-300">
              <thead>
                <tr className="bg-gray-800/50">
                  <th className="p-2 text-left">Project</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Tech Stack</th>
                  <th className="p-2 text-left">Link</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-900/50 hover:bg-gray-800/70 transition-colors duration-200">
                  <td className="p-2">Count</td>
                  <td className="p-2">A Zikr counter for recitations.</td>
                  <td className="p-2">CSS</td>
                  <td className="p-2"><a href="https://github.com/Zubair-hussain/Count" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Code</a></td>
                </tr>
                <tr className="bg-gray-900/50 hover:bg-gray-800/70 transition-colors duration-200">
                  <td className="p-2">Portfolio</td>
                  <td className="p-2">Personal portfolio built with HTML.</td>
                  <td className="p-2">HTML</td>
                  <td className="p-2"><a href="https://github.com/Zubair-hussain/Potfolio-" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Code</a></td>
                </tr>
                <tr className="bg-gray-900/50 hover:bg-gray-800/70 transition-colors duration-200">
                  <td className="p-2">React-f-project</td>
                  <td className="p-2">My first React (v18) app.</td>
                  <td className="p-2">React 18, JavaScript</td>
                  <td className="p-2"><a href="https://github.com/Zubair-hussain/React-f-project" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Code</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tech Stack - Badges */}
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-4">Tech Stack & Tools</h3>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-gray-800/50 px-2 py-1 rounded-full text-xs md:text-sm text-gray-300">HTML5</span>
            <span className="bg-gray-800/50 px-2 py-1 rounded-full text-xs md:text-sm text-gray-300">CSS3</span>
            <span className="bg-gray-800/50 px-2 py-1 rounded-full text-xs md:text-sm text-gray-300">JavaScript</span>
            <span className="bg-gray-800/50 px-2 py-1 rounded-full text-xs md:text-sm text-gray-300">TypeScript</span>
            <span className="bg-gray-800/50 px-2 py-1 rounded-full text-xs md:text-sm text-gray-300">React</span>
            <span className="bg-gray-800/50 px-2 py-1 rounded-full text-xs md:text-sm text-gray-300">Next.js</span>
            <span className="bg-gray-800/50 px-2 py-1 rounded-full text-xs md:text-sm text-gray-300">TailwindCSS</span>
            <span className="bg-gray-800/50 px-2 py-1 rounded-full text-xs md:text-sm text-gray-300">Node.js</span>
            <span className="bg-gray-800/50 px-2 py-1 rounded-full text-xs md:text-sm text-gray-300">Firebase</span>
            <span className="bg-gray-800/50 px-2 py-1 rounded-full text-xs md:text-sm text-gray-300">Python</span>
            <span className="bg-gray-800/50 px-2 py-1 rounded-full text-xs md:text-sm text-gray-300">Pandas</span>
          </div>
        </div>

        {/* Achievements & Certifications */}
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-4">Achievements & Certifications</h3>
          <ul className="text-sm md:text-base text-gray-300 list-disc pl-4 space-y-2">
            <li>Top 10% in multiple Kaggle competitions</li>
            <li>Built & maintained 5+ public projects</li>
            <li>Completed 50+ data analysis notebooks</li>
            <li>Full Stack Web Development – Coursera</li>
            <li>AI Engineer Professional Certificate – Coursera</li>
            <li>Responsive Web Design – freeCodeCamp</li>
            <li>Data Analysis with Python – freeCodeCamp</li>
            <li>React Native & Mobile App Development – Udemy</li>
          </ul>
        </div>

        {/* Connect with Me */}
        <div className="mb-6 text-center">
          <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-4">Connect with Me</h3>
          <div className="flex justify-center gap-4">
            <a href="https://zubairhussainportfolio.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Portfolio</a>
            <a href="mailto:zubairhussain@example.com" className="text-blue-400 hover:text-blue-300">Email</a>
            <a href="https://instagram.com/zubairhussain" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Instagram</a>
            <a href="https://github.com/Zubair-hussain" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">GitHub</a>
          </div>
        </div>

        {/* Contact Button */}
        <div className="flex justify-center">
          <a
            href="#contact"
            className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 hover:shadow-purple-500/30 transition-all duration-300 text-sm md:text-base"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;