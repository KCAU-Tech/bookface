// PostContent.jsx
const PostContent = ({ text, photoUrl }) => {
  return (
    <div className="px-4 pb-4">
      <p className="mb-3">{text}</p>

      {photoUrl && (
        <div className="rounded-md overflow-hidden">
          <img
            src={photoUrl}
            alt="Post image"
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default PostContent;
