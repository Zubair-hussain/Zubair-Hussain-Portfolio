import { useState, useEffect } from "react";
import gsap from "gsap";

// List of bad words (add more if needed)
const badWords = ["fuck", "bitch", "shit", "motherfucker", "asshole"];

const MAX_COMMENTS = 5;

const ClientComments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Load comments from localStorage on first render
  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem("clientComments"));
    if (storedComments && storedComments.length > 0) {
      setComments(storedComments);
    } else {
      // Default comments if localStorage is empty
      const defaultComments = [
        {
          id: 1,
          user: "John Doe",
          profilePic: "https://i.pravatar.cc/40?img=1",
          text: "Great experience working with Zubair!",
          time: "2 hours ago",
        },
        {
          id: 2,
          user: "Sarah Khan",
          profilePic: "https://i.pravatar.cc/40?img=2",
          text: "Very professional and delivers on time!",
          time: "5 hours ago",
        },
      ];
      setComments(defaultComments);
      localStorage.setItem("clientComments", JSON.stringify(defaultComments));
    }
  }, []);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem("clientComments", JSON.stringify(comments));
    }
  }, [comments]);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    // Check for bad words
    const containsBadWords = badWords.some((word) =>
      newComment.toLowerCase().includes(word)
    );

    if (containsBadWords) {
      alert("Your comment contains inappropriate words and won't be posted.");
      setNewComment(""); // Clear input
      return;
    }

    const newEntry = {
      id: Date.now(),
      user: "Anonymous", // Always shows "Anonymous"
      profilePic: `https://i.pravatar.cc/40?u=${Date.now()}`, // Unique profile image for each comment
      text: newComment,
      time: "Just now",
    };

    setComments((prev) => {
      const updated = [newEntry, ...prev];
      return updated.length > MAX_COMMENTS ? updated.slice(0, MAX_COMMENTS) : updated;
    });

    setNewComment(""); // Clear input

    // Animate only the newly added comment
    setTimeout(() => {
      gsap.fromTo(
        `.comment-box:first-child`,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }, 10);
  };

  return (
    <section id="Contact" className="py-10 px-6 text-center bg-gray-50 text-black">
      <h2 className="text-3xl font-bold mb-6">What Clients Say About Me</h2>

      <div className="max-w-2xl mx-auto space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-box flex gap-3 p-3 border-b bg-white shadow-md rounded-lg">
            <img src={comment.profilePic} alt="User" className="w-10 h-10 rounded-full border" />
            <div className="text-left">
              <h3 className="text-sm font-semibold">{comment.user}</h3>
              <p className="text-xs text-gray-500">{comment.time}</p>
              <p className="mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment Section */}
      <div className="mt-6 max-w-lg mx-auto">
        <div className="flex items-center bg-gray-100 p-2 rounded-lg border">
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 p-2 bg-transparent focus:outline-none"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />
          <button onClick={handleAddComment} className="text-blue-500 hover:text-blue-600">
            ➤
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Your feedback helps others understand my work!</p>
      </div>

      {/* Total Comments */}
      <p className="text-gray-500 mt-4">Total Comments: {comments.length}</p>
    </section>
  );
};

export default ClientComments;
