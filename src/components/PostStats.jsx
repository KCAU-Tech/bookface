// PostStats.jsx
const PostStats = ({ likesCount, commentsCount }) => {
  return (
    <div className="px-4 py-2 border-t border-b flex justify-between text-gray-500 text-sm">
      <div>
        {likesCount} {likesCount === 1 ? "like" : "likes"}
      </div>
      <div>
        {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
      </div>
    </div>
  );
};

export default PostStats;
