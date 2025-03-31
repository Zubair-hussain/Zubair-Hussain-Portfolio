import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import profile from "../assets/profile.jpg";

const Contact = () => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })
      .fromTo(
        sectionRef.current,
        { opacity: 0, y: "100%" },
        { opacity: 1, y: "0%", duration: 1 }
      );
  }, []);

  return (
    <>
      <div ref={triggerRef} className="h-[100vh]"></div>


      <section 
       
        ref={sectionRef}
        className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black text-white px-8 pb-24"
      >
        <div className="flex flex-row items-center space-x-10">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-77 h-77 rounded-full border-4 border-transparent animate-border-spin">
              <img
                src={profile}
                alt="Profile"
                className="w-full h-full object-cover rounded-full transition-shadow duration-300 cursor-pointer hover:shadow-[0_0_50px_10px_rgba(0,0,255,0.5)]"
              />
            </div>
          </div>

          
          <div className="text-left max-w-lg">
            <h2 className="text-4xl font-bold text-orange-500 mb-4">Let's Connect</h2>
            <p className="text-lg mb-6 text-gray-300">
              I am a passionate <span className="font-bold text-orange-400">Full Stack Developer</span>  
              with expertise in <span className="font-bold text-blue-400">React</span>,  
              <span className="font-bold text-green-400">UI/UX design</span>,  
              <span className="font-bold text-purple-400">backend development</span>,  
              and <span className="font-bold text-pink-400">animations</span>.  
              <br />
              I create visually appealing, high-performance, and user-friendly websites  
              that bring ideas to life.  
              <br />
              <span className="text-yellow-400 font-extrabold">Let's build something amazing together.</span>
            </p>

           
            <div className="flex space-x-4">
              <a 
                href="mailto:detroonshah@gmail.com?subject=Hiring%20Inquiry&body=Hi,%20I'm%20interested%20in%20working%20with%20you!"
                className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition"
              >
                Hire Me
              </a>
              <button 
                onClick={() => navigate("/qualifications")}
                className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition"
              >
                Qualifications
              </button>
            </div>
          </div>
        </div>

        
        <div className="absolute bottom-8 flex space-x-6">
          <a href="https://www.instagram.com/detro_onshah?igsh=OWdjNmtleDlscXVr" className="text-orange-500 hover:text-pink-500 transition">
            <FaInstagram size={30} />
          </a>
          <a href="https://www.facebook.com/share/1ZXjcZ4aG2/" className="text-orange-500 hover:text-blue-600 transition">
            <FaFacebookF size={30} />
          </a>
          <a href="https://www.linkedin.com/in/zubair-hussain-50a472359?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="text-orange-500 hover:text-blue-700 transition">
            <FaLinkedinIn size={30} />
          </a>
          <a href="https://youtube.com/@detroonshah-786?si=Vqy7mQrQIBxbt6Uo" className="text-orange-500 hover:text-red-600 transition">
            <FaYoutube size={30} />
          </a>
        </div>
      </section>
    </>
  );
};

export default Contact;
