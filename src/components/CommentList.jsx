// CommentList.jsx
import Image from "next/image";
import CommentItem from "./CommentItem";

const CommentList = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm py-2">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment, index) => (
        <CommentItem key={index} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
