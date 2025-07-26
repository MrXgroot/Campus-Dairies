import React, { useEffect } from "react";
import usePostStore from "../store/postStore";
import PostCard from "../components/post/PostCard";
import { useParams } from "react-router-dom";
import Header from "../components/header/Header";
const SinglePostDisplay = () => {
  const post = usePostStore((state) => state.singlePost);
  const loading = usePostStore((state) => state.loadingPosts);
  const fetchSinglePost = usePostStore((state) => state.fetchSinglePost);
  const { id } = useParams();

  console.log("hii");
  useEffect(() => {
    fetchSinglePost(id);
    console.log("Calling");
  }, [id]);

  if (loading || !post || post._id !== id) {
    return <LoadingScreen />;
  }

  return (
    <div className="dark:bg-gray-900 bg-white">
      <Header />
      <div className="max-w-md mx-auto py-20">
        <PostCard post={post} />
      </div>
    </div>
  );
};

export default SinglePostDisplay;

const LoadingScreen = () => (
  <div className="min-h-screen  bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
      <p className="text-gray-600 dark:text-gray-300">Loading your feed...</p>
    </div>
  </div>
);
