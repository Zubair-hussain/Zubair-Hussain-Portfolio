import { useState } from "react";
import emailjs from "@emailjs/browser";


const NewIdeaForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    setError("");
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setSuccess("✅ Your message has been sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        () => {
          setError("❌ Failed to send message. Please try again.");
        }
      );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Let's Work Together! 🚀
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
          />
          <textarea
            name="message"
            placeholder="Your Project Idea"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            rows="4"
          ></textarea>

          <button
            type="submit"
            className="w-full mt-4 p-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
          >
            Send Idea 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewIdeaForm;
