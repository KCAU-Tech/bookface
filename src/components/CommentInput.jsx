// CommentInput.jsx
import Image from "next/image";
import { Send } from "lucide-react";

const CommentInput = ({
  user,
  newComment,
  setNewComment,
  handleAddComment,
  commentInputRef,
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden shrink-0">
        {user?.photoURL ? (
          <Image
            src={user?.photoURL}
            alt={user.username || ""}
            width={32}
            height={32}
            className="object-cover"
          />
        ) : (
          <span className="text-xs">{user?.username || "?"}</span>
        )}
      </div>

      <div className="flex-1 flex gap-2">
        <input
          ref={commentInputRef}
          type="text"
          placeholder="Write a comment..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddComment();
          }}
        />

        <button
          className="text-primary bg-blue-50 p-2 rounded-full hover:bg-blue-100 disabled:opacity-50"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
