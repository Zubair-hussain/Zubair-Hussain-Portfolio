import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { database, auth, googleProvider } from "../../firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import {
  ref,
  push,
  onValue,
  limitToLast,
  query,
  remove,
} from "firebase/database";
import {
  signInAnonymously,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const badWords = ["fuck", "bitch", "shit", "motherfucker", "asshole"];
const MAX_COMMENTS = 5;
const MAX_COMMENT_LENGTH = 200;

const ClientComments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState(null); // New state for auth-specific errors

  const inputRef = useRef(null);
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setIsAdmin(currentUser?.email === ADMIN_EMAIL);
        setLoading(false);
        setAuthError(null); // Clear auth error on successful auth
      },
      (err) => {
        console.error("Auth state error:", err);
        setError("Failed to initialize authentication. Please try again.");
        setAuthError("Authentication failed. Check your network or try again later.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (inputRef.current && user) {
      gsap.fromTo(
        inputRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [user]);

  useEffect(() => {
    const commentsRef = ref(database, "comments");
    const commentsQuery = query(commentsRef, limitToLast(MAX_COMMENTS));

    const unsubscribe = onValue(
      commentsQuery,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const commentsArray = Object.entries(data)
            .map(([id, comment]) => ({
              id,
              user: comment.user,
              profilePic: comment.profilePic,
              text: comment.text,
              time: comment.time,
              verified: comment.verified || false,
            }))
            .reverse();
          setComments(commentsArray);
        } else {
          setComments([]);
        }
      },
      (err) => {
        console.error("Database error:", err);
        setError("Failed to load comments. Please check your connection.");
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddComment = () => {
    if (newComment.trim() === "") {
      setError("Comment cannot be empty.");
      return;
    }

    const containsBadWords = badWords.some((word) =>
      newComment.toLowerCase().includes(word)
    );
    if (containsBadWords) {
      setError("Your comment contains inappropriate words.");
      setNewComment("");
      return;
    }

    const newEntry = {
      user: user?.displayName || "Anonymous",
      profilePic:
        user?.photoURL || `https://i.pravatar.cc/40?u=${Date.now()}`,
      text: newComment,
      time: new Date().toLocaleString(),
      uid: user?.uid,
      verified: !!user?.email,
    };

    push(ref(database, "comments"), newEntry)
      .then(() => {
        setNewComment("");
        setError(null);
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
        setError("Failed to add comment. Try again.");
      });
  };

  const handleAnonymousSignIn = () => {
    setAuthError(null);
    signInAnonymously(auth).catch((error) => {
      console.error("Anonymous sign-in failed:", error);
      setAuthError("Failed to sign in anonymously. Please try again.");
    });
  };

  const handleGoogleSignIn = () => {
    setAuthError(null);
    signInWithPopup(auth, googleProvider).catch((err) => {
      console.error("Google Sign-in failed:", err);
      setAuthError("Google sign-in failed. Please check your network or try again.");
    });
  };

  const handleSignOut = () => {
    signOut(auth).catch((err) => {
      console.error("Sign-out failed:", err);
      setAuthError("Failed to sign out. Please try again.");
    });
  };

  const handleDeleteComment = (id) => {
    if (!isAdmin) return;
    remove(ref(database, `comments/${id}`)).catch((err) => {
      console.error("Failed to delete comment:", err);
      setError("Failed to delete comment. Try again.");
    });
  };

  // Optional: Add Email/Password Sign-In (uncomment to enable)
  /*
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailSignIn = () => {
    setAuthError(null);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        console.error("Email Sign-in failed:", err);
        setAuthError("Email sign-in failed. Check your credentials or try again.");
      });
  };
  */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div
          className="w-12 h-12 border-4 border-t-transparent border-blue-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  if (error && !authError) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            What Clients Say
          </h2>
          <p className="text-red-400 font-medium text-sm sm:text-base">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="ClientComments"
      className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          What Clients Say
        </motion.h2>

        <motion.p
          className="text-sm sm:text-base md:text-lg text-gray-300 mb-10 max-w-3xl mx-auto text-center leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Share your feedback publicly. Your email remains private, and verified users get a badge. 
          <span className="text-blue-400 font-semibold">Inappropriate comments</span> may be removed by the admin.
        </motion.p>

        {authError && (
          <motion.p
            className="text-red-400 font-medium text-sm sm:text-base text-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {authError}
          </motion.p>
        )}

        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl hover:border-blue-400/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3 sm:gap-4 w-full">
                  <motion.img
                    src={comment.profilePic}
                    alt={`${comment.user}'s profile`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-400/50"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                      {comment.user}
                      {comment.verified && (
                        <span className="inline-flex items-center gap-1 text-blue-400 text-xs bg-blue-500/10 px-2 py-1 rounded-full">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified
                        </span>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">{comment.time}</p>
                    <p className="mt-2 text-gray-200 text-sm sm:text-base leading-relaxed break-words">{comment.text}</p>
                  </div>
                </div>
                {isAdmin && (
                  <motion.button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="w-full sm:w-auto mt-2 sm:mt-0 px-3 py-1 text-red-400 font-medium hover:text-red-300 bg-red-500/10 rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 max-w-lg mx-auto">
          {user ? (
            <motion.div
              ref={inputRef}
              className="bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <label
                htmlFor="comment"
                className="block mb-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                Share Your Feedback ✍️
              </label>
              <motion.textarea
                id="comment"
                rows="4"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                placeholder="Share your thoughts..."
                className="w-full p-3 sm:p-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0px 0px 12px rgba(59, 130, 246, 0.3)",
                }}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment()}
              />
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm text-gray-400">
                  {newComment.length}/{MAX_COMMENT_LENGTH} characters
                </p>
                <motion.button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Post Comment 🚀
                </motion.button>
              </div>
              <motion.button
                onClick={handleSignOut}
                className="w-full sm:w-auto mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-lg border border-white/20 hover:border-blue-400/50 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Out
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                onClick={handleAnonymousSignIn}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-lg border border-white/20 hover:border-blue-400/50 hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Anonymously
              </motion.button>
              <motion.button
                onClick={handleGoogleSignIn}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 hover:shadow-blue-500/25 transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign in with Google
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Optional: Email/Password Sign-In Form (uncomment to enable) */}
        {/*
        {!user && (
          <motion.div
            className="mt-6 max-w-lg mx-auto bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/20 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <label
              htmlFor="email"
              className="block mb-2 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Sign in with Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full p-3 sm:p-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
            />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full p-3 sm:p-4 mt-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
            />
            <motion.button
              onClick={handleEmailSignIn}
              className="w-full mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 hover:shadow-blue-500/25 transition-all duration-300 text-sm sm:text-base"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in with Email
            </motion.button>
          </motion.div>
        )}
        */}

        <motion.p
          className="text-gray-300 mt-8 text-center text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Total Comments: <span className="text-blue-400 font-semibold">{comments.length}</span>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-blue-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ClientComments;