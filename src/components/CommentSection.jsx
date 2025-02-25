// CommentSection.jsx
import { useState, useEffect, useRef } from "react";
import {
  getComments,
  addDocument,
  updateDocument,
  getDocument,
} from "@/utils/firestore";
import CommentInput from "@/components/CommentInput";
import CommentList from "@/components/CommentList";

const CommentSection = ({ postId, user, updateCommentCount }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const commentInputRef = useRef(null);

  useEffect(() => {
    console.log(user);
    fetchComments();
    // Focus the comment input when opening comments
    if (commentInputRef.current) {
      setTimeout(() => {
        commentInputRef.current.focus();
      }, 100);
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      // Get all comments for this post
      const result = await getComments(postId);

      if (result.success) {
        const fetchedComments = result.data || [];

        // Fetch the authors for each comment
        const commentsWithAuthors = await Promise.all(
          fetchedComments.map(async (comment) => {
            // This function would be similar to what you have in your original code
            // but simplified to avoid redundancy
            return await enrichCommentWithAuthor(comment);
          })
        );

        setComments(commentsWithAuthors.filter(Boolean));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const enrichCommentWithAuthor = async (comment) => {
    try {
      const authorResult = await getDocument("users", comment.userId);
      if (authorResult.success) {
        return {
          ...comment,
          author: authorResult.data,
        };
      }
      return comment;
    } catch (error) {
      console.error("Error fetching comment author:", error);
      return comment;
    }
  };

  const handleAddComment = async () => {
    console.log("Adding Comment");
    if (!newComment.trim() || !user?.id) return;

    try {
      // Add comment to subcollection
      const comment = {
        text: newComment,
        createdAt: new Date(),
        userId: user.id,
      };

      console.log(comment);

      await addDocument(`posts/${postId}/comments`, comment);

      // Get current post data
      const postResult = await getDocument("posts", postId);
      if (postResult.success) {
        // Update post's comment count
        const currentComments = postResult.data.comments || 0;
        await updateDocument("posts", postId, {
          comments: currentComments + 1,
        });
      }

      // Update UI
      updateCommentCount(1);
      setNewComment("");

      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="px-4 py-2">
      <CommentInput
        user={user}
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
        commentInputRef={commentInputRef}
      />

      <CommentList comments={comments} />
    </div>
  );
};

export default CommentSection;
