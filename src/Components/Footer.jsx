import { FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-gray-900 text-white py-6 px-4">
    <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
      <p>© 2025 Zubair Hussain</p>
      <div className="flex gap-6">
        <a
          href="https://www.instagram.com/detro_onshah?igsh=OWdjNmtleDlscXVr"
          className="text-blue-600 hover:text-blue-400"
          aria-label="Instagram"
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://www.facebook.com/share/1ZXjcZ4aG2/"
          className="text-blue-600 hover:text-blue-400"
          aria-label="Facebook"
        >
          <FaFacebookF size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/zubair-hussain-50a472359"
          className="text-blue-600 hover:text-blue-400"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn size={24} />
        </a>
        <a
          href="https://youtube.com/@detroonshah-786?si=Vqy7mQrQIBxbt6Uo"
          className="text-blue-600 hover:text-blue-400"
          aria-label="YouTube"
        >
          <FaYoutube size={24} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
