// CommentItem.jsx
import Image from "next/image";

const CommentItem = ({ comment }) => {
  return (
    <div className="flex items-start gap-2 mb-3">
      {comment.author?.photoURL ? (
        <Image
          src={comment.author.photoURL}
          alt={comment.author.firstName || "User"}
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-sm text-gray-500">
            {comment.author?.username?.charAt(0) || "?"}
          </span>
        </div>
      )}

      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg px-3 py-2">
          <p className="font-semibold text-sm">
            {comment.author?.username || "Anonymous"}
          </p>
          <p className="text-sm">{comment.text}</p>
        </div>

        <span className="text-xs text-gray-500 ml-2">
          {formatCommentDate(comment.createdAt)}
        </span>
      </div>
    </div>
  );
};

// Helper function for formatting the date
const formatCommentDate = (timestamp) => {
  if (!timestamp) return "";

  let date;
  if (typeof timestamp === "string") {
    date = new Date(timestamp);
  } else if (timestamp && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return "";
  }

  return date.toLocaleDateString();
};

export default CommentItem;
