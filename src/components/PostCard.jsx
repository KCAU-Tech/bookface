// PostCard.jsx
import { useState, useEffect } from "react";
import { getDocument, updateDocument, setDocument } from "@/utils/firestore";
import PostHeader from "@/components/PostHeader";
import PostContent from "@/components/PostContent";
import PostStats from "@/components/PostStats";
import PostActions from "@/components/PostActions";
import CommentSection from "@/components/CommentSection";

const PostCard = ({ post, user }) => {
  const [author, setAuthor] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments || 0);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const result = await getDocument("users", post.userId);
        if (result.success) {
          setAuthor(result.data);
        }
      } catch (error) {
        console.error("Error fetching post author:", error);
      }
    };

    // Check if current user has liked this post
    const checkLiked = async () => {
      if (!user?.id) return;

      try {
        const result = await getDocument(`posts/${post.id}/likes`, user.id);
        setIsLiked(result.success && result.data?.liked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    fetchAuthor();
    checkLiked();
  }, [post.userId, post.id, user?.id]);

  const handleLike = async () => {
    if (!user?.id) {
      alert("Please login to like posts");
      return;
    }

    try {
      // Toggle like status
      const newLikedStatus = !isLiked;

      // Set likes subcollection document for this user
      await setDocument(`posts/${post.id}/likes`, user.id, {
        liked: newLikedStatus,
        userId: user.id,
        timestamp: new Date().toISOString(),
      });

      // Update post's like count
      const increment = newLikedStatus ? 1 : -1;
      await updateDocument("posts", post.id, {
        likes: (post.likes || 0) + increment,
      });

      // Update UI
      setIsLiked(newLikedStatus);
      setLikesCount((prevCount) => prevCount + increment);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentClick = () => {
    setShowComments((prev) => !prev);
  };

  const updateCommentCount = (increment) => {
    setCommentsCount((prevCount) => prevCount + increment);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      <PostHeader author={author} createdAt={post.createdAt} />
      <PostContent text={post.text} photoUrl={post.photoUrl} />
      <PostStats likesCount={likesCount} commentsCount={commentsCount} />
      <PostActions
        isLiked={isLiked}
        showComments={showComments}
        onLike={handleLike}
        onCommentClick={handleCommentClick}
      />
      {showComments && (
        <CommentSection
          postId={post.id}
          user={user}
          updateCommentCount={updateCommentCount}
        />
      )}
    </div>
  );
};

export default PostCard;
