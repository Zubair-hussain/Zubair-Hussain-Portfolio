import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (formData.file && !["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(formData.file.type)) {
      newErrors.file = "Supported file types: PDF, DOC, DOCX";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("❌ EmailJS configuration missing. Check your .env file.");
      console.error("Missing EmailJS env variables:", { serviceId, templateId, publicKey });
      return;
    }

    try {
      let templateParams = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      // Handle file attachment (base64 conversion)
      if (formData.file) {
        if (!templateId.includes("template_")) {
          setStatus("❌ File uploads require an EmailJS Pro plan and correct template ID.");
          return;
        }
        const base64File = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(formData.file);
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (error) => reject(error);
        });
        templateParams.file = base64File;
        templateParams.file_name = formData.file.name;
        templateParams.file_type = formData.file.type;
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "", file: null });
      setErrors({});
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus(`❌ Failed to send: ${error.text || "Check EmailJS setup or network."}`);
    }
  };

  // Form animation (slide-in, subtle, professional)
  const formVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-blue-300 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        variants={formVariants}
        initial="initial"
        animate="animate"
        className="w-full bg-white p-6 rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Contact Zubair Hussain 🚀
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold text-base" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
              placeholder="Enter your full name"
              aria-label="Your Full Name"
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold text-base" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
              placeholder="Enter your professional email"
              aria-label="Your Email Address"
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold text-base" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
              placeholder="E.g., Project Inquiry or Collaboration"
              aria-label="Subject"
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
            {errors.subject && (
              <p id="subject-error" className="text-red-500 text-sm mt-1">
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold text-base" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
              placeholder="Describe your project or requirements"
              rows="5"
              aria-label="Your Message"
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <p id="message-error" className="text-red-500 text-sm mt-1">
                {errors.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold text-base" htmlFor="file">
              Attach Requirements (PDF, DOC, DOCX)
            </label>
            <input
              id="file"
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-base"
              accept=".pdf,.doc,.docx"
              aria-label="Attach Requirements File"
              aria-describedby={errors.file ? "file-error" : undefined}
            />
            {errors.file && (
              <p id="file-error" className="text-red-500 text-sm mt-1">
                {errors.file}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">Max file size: 200KB (EmailJS free plan)</p>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition text-base"
          >
            Send Message
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center font-medium text-gray-700 text-base">{status}</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;
