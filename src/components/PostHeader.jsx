// PostHeader.jsx
import Image from "next/image";
import Link from "next/link";
import { formatTime } from "@/utils/formatters";

const PostHeader = ({ author, createdAt }) => {
  if (!author) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="w-24 h-5 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-primary overflow-hidden">
          {author?.photoURL ? (
            <Image
              src={author.photoURL}
              alt={`${author.firstName} ${author.lastName}`}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <span>
              {author.firstName?.[0]}
              {author.lastName?.[0]}
            </span>
          )}
        </div>
        <div>
          {/* When clicked it should redirect to the user's profile (e.g., `/profile/${author.username}`) */}
          <Link
            href="#"
            className="font-medium text-gray-700 hover:text-primary"
          >
            {author.firstName} {author.lastName}
          </Link>
          <p className="text-xs text-gray-500">{formatTime(createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
