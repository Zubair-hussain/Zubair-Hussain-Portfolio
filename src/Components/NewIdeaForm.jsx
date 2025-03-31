import { useState } from "react";
import emailjs from "emailjs-com";

const NewIdeaForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    setError(""); // Clear errors if any

    // Send email using EmailJS
    emailjs
      .send(
        "service_jzchra6", // Your EmailJS Service ID
        "template_wuhacrm", // Your EmailJS Template ID
        formData,
        "ZaRMnXC0MWC0RkhcQ" // Your EmailJS Public Key
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setSuccess("Your message has been sent successfully! ✅");
          setFormData({ name: "", email: "", message: "" }); // Reset form
        },
        (err) => {
          console.log("FAILED...", err);
          setError("Failed to send message. Please try again.");
        }
      );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Let's Work Together! 🚀
        </h2>
        <p className="text-center text-gray-600">
          Share your idea, and let's build something great.
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Your Name"
          />

          <label className="block mt-4 mb-2 text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Your Email"
          />

          <label className="block mt-4 mb-2 text-gray-700">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows="4"
            placeholder="Your Project Idea"
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
