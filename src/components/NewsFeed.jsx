"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContextProvider";
import { getDocument } from "@/utils/firestore";
import CreatePostCard from "./CreatePostCard";
import PostCard from "./PostCard";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

const NewsFeed = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const getUserDocument = async (user) => {
        try {
          const result = await getDocument("users", user.uid);
          setUserData(result.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      getUserDocument(user);
    }
  }, [user]);

  // Set up real-time listener for posts
  useEffect(() => {
    // Create a query for the posts collection, sorted by creation time
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    // Set up the real-time listener
    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const postsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to posts collection:", error);
        setLoading(false);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CreatePostCard userData={userData} />

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 flex justify-center">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} user={userData} />
          ))}

          {posts.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
              <p className="text-gray-600">
                Be the first one to post and start the conversation!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsFeed;
