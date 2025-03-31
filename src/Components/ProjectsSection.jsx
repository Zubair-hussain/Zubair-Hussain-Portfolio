import { useEffect, useRef } from "react";
import gsap from "gsap";

const projects = [
  {
    title: "Portfolio Website",
    description: "A sleek portfolio website showcasing my projects and skills.",
    link: "https://zubair-hussain.github.io/Potfolio-/",
  },
  {
    title: "E-Commerce App",
    description: "An online shopping platform with React and Firebase.",
    link: "https://zubair-hussain236.github.io/Organic-products-/",
  },
  {
    title: "Count Button",
    description: "A simple counter app built with HTML, CSS, and JavaScript.",
    link: "https://zubair-hussain.github.io/Count/",
  },
  {
    title: "Quiz Game App",
    description: "A fun quiz game built with JavaScript.",
    link: " https://zubair-hussain236.github.io/Quiz-Game-Using-Java-Script/",
  },
  {
    title: "Sundown Webpage",
    description: "Sundown is a multi-disciplinary studio focused on creating unique, end-to-end experiences and environments.",
    link: "https://zubair-hussain236.github.io/SunDown-Webpage-/",
  },
  {
    title: "Your Next Idea?",
    description: "Got a project in mind? Let's build something amazing together! 🚀",
    link: "/new-idea-form", 
  },
];

const ProjectsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const bgAnimation = gsap.to(sectionRef.current, {
      backgroundPosition: "200% 0",
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "linear",
    });

    gsap.set(".project-card", { opacity: 0, y: 50 });
    const cardAnimation = gsap.to(".project-card", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.3,
      ease: "power3.out",
    });

    return () => {
      bgAnimation.kill();
      cardAnimation.kill();
    };
  }, []);

  return (
    <section id="Projects" ref={sectionRef} className="relative py-16 px-8">
      <div className="absolute inset-0 projects-bg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 transition-all duration-[4000ms]"></div>

      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-center text-white mb-10">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="project-card p-6 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-gray-200"
            >
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-gray-600">{project.description}</p>
              <a
                href={project.link}
                target={project.title === "Your Next Idea?" ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-700 font-semibold hover:underline"
              >
                {project.title === "Your Next Idea?" ? "Let's Work Together →" : "View Project →"}
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-white text-sm mt-10 opacity-70"> 
          I am a <a href="https://github.com/Zubair-Hussain236"><b>fresh developer</b> </a>, trying to enhance myself & be more productive.
        </p>
      </div>
    </section>
  );
};

export default ProjectsSection;
