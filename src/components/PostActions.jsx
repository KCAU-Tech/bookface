// PostActions.jsx
import { FaRegThumbsUp, FaThumbsUp, FaRegComment } from "react-icons/fa6";
import { Share2 } from "lucide-react";

const PostActions = ({ isLiked, showComments, onLike, onCommentClick }) => {
  return (
    <div className="p-2 flex justify-between">
      <button
        className={`flex items-center gap-2 px-4 py-1 rounded-lg flex-1 justify-center ${
          isLiked
            ? "text-secondary hover:bg-gray-200"
            : "text-gray-600 hover:bg-gray-200 hover:text-secondary"
        }`}
        onClick={onLike}
      >
        {isLiked ? (
          <FaThumbsUp className="w-6 h-6 cursor-pointer hover:text-secondary/80 transition-colors" />
        ) : (
          <FaRegThumbsUp className="w-6 h-6 cursor-pointer hover:text-secondary transition-colors" />
        )}
        <span>Like</span>
      </button>

      <button
        className={`flex items-center gap-2 px-4 py-1 rounded-lg flex-1 justify-center hover:bg-gray-200 ${
          showComments
            ? "text-primary bg-blue-50"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        onClick={onCommentClick}
      >
        <FaRegComment size={18} />
        <span>Comment</span>
      </button>

      <button className="flex items-center gap-2 text-gray-600 px-4 py-1 rounded-lg flex-1 justify-center hover:bg-gray-200">
        <Share2 size={18} />
        <span>Share</span>
      </button>
    </div>
  );
};

export default PostActions;
