import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import {
  initializeApp
} from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  onValue,
  limitToLast,
  query,
  remove
} from "firebase/database";
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider
} from "firebase/auth";

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const badWords = ["fuck", "bitch", "shit", "motherfucker", "asshole"];
const MAX_COMMENTS = 5;
const MAX_COMMENT_LENGTH = 200;

const ClientComments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const inputRef = useRef(null);
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setIsAdmin(currentUser?.email === ADMIN_EMAIL);
        setLoading(false);
        setAuthError(null);
      },
      (err) => {
        console.error("Auth state error:", err);
        setError("Failed to initialize authentication.");
        setAuthError("Authentication failed. Check your network or try again.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Animate input
  useEffect(() => {
    if (inputRef.current && user) {
      gsap.fromTo(
        inputRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [user]);

  // Fetch comments
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
        setError("Failed to load comments.");
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    if (badWords.some((word) => newComment.toLowerCase().includes(word))) {
      setError("Your comment contains inappropriate words.");
      setNewComment("");
      return;
    }

    const newEntry = {
      user: user?.displayName || "Anonymous",
      profilePic: user?.photoURL || `https://i.pravatar.cc/40?u=${Date.now()}`,
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
      .catch((err) => {
        console.error("Error adding comment:", err);
        setError("Failed to add comment. Try again.");
      });
  };

  const handleAnonymousSignIn = () => {
    setAuthError(null);
    signInAnonymously(auth).catch((err) => {
      console.error("Anonymous sign-in failed:", err);
      setAuthError("Failed to sign in anonymously. Please try again.");
    });
  };

  const handleGoogleSignIn = () => {
    setAuthError(null);
    signInWithPopup(auth, googleProvider).catch((err) => {
      console.error("Google sign-in failed:", err);
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
                  />
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                      {comment.user}
                      {comment.verified && (
                        <span className="inline-flex items-center gap-1 text-blue-400 text-xs bg-blue-500/10 px-2 py-1 rounded-full">
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
            >
              <textarea
                rows="4"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                placeholder="Share your thoughts..."
                className="w-full p-3 sm:p-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-sm sm:text-base"
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment()}
              />
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm text-gray-400">
                  {newComment.length}/{MAX_COMMENT_LENGTH} characters
                </p>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment 🚀
                </button>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full sm:w-auto mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-lg border border-white/20 hover:border-blue-400/50 hover:bg-white/20"
              >
                Sign Out
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={handleAnonymousSignIn}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-lg border border-white/20 hover:border-blue-400/50 hover:bg-white/20"
              >
                Continue Anonymously
              </button>
              <button
                onClick={handleGoogleSignIn}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 hover:shadow-blue-500/25"
              >
                Sign in with Google
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-300 mt-8 text-center text-sm sm:text-base">
          Total Comments: <span className="text-blue-400 font-semibold">{comments.length}</span>
        </p>
      </div>
    </section>
  );
};

export default ClientComments;
