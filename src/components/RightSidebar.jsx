"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Calendar, TrendingUp, UserPlus } from "lucide-react";

const RightSidebar = () => {
  // In a real application, you would fetch this data from your backend
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "KCAU Tech Meetup",
      date: "March 3, 2025",
      location: "Innovation Hub",
    },
    {
      id: 2,
      title: "Business Summit",
      date: "March 10, 2025",
      location: "Main Auditorium",
    },
    {
      id: 3,
      title: "Career Fair",
      date: "March 15, 2025",
      location: "Library Complex",
    },
  ]);

  const [trendingPosts, setTrendingPosts] = useState([
    {
      id: 1,
      title: "KCAU Tech Club launches new website",
      likes: 342,
      comments: 78,
    },
    {
      id: 2,
      title: "Sports Day preparations in full swing",
      likes: 230,
      comments: 45,
    },
    {
      id: 3,
      title: "Student success stories: Meet our top achievers",
      likes: 185,
      comments: 32,
    },
  ]);

  const [suggestedFriends, setSuggestedFriends] = useState([
    {
      id: 1,
      name: "Jane Smith",
      course: "BSc Computer Science",
      avatarUrl: null,
    },
    {
      id: 2,
      name: "John Doe",
      course: "BSc Business IT",
      avatarUrl: null,
    },
    {
      id: 3,
      name: "Sarah Williams",
      course: "BA Economics",
      avatarUrl: null,
    },
  ]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={20} className="text-primary" />
          <h3 className="font-semibold text-lg">Upcoming Events</h3>
        </div>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="border-b pb-2 last:border-0 last:pb-0"
            >
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-gray-600">{event.date}</p>
              <p className="text-sm text-gray-600">{event.location}</p>
            </div>
          ))}
        </div>
        <Link
          href="/events"
          className="text-primary hover:underline text-sm block mt-3"
        >
          See all events
        </Link>
      </div>

      {/* Trending Posts */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={20} className="text-primary" />
          <h3 className="font-semibold text-lg">Trending Posts</h3>
        </div>
        <div className="space-y-3">
          {trendingPosts.map((post) => (
            <div
              key={post.id}
              className="border-b pb-2 last:border-0 last:pb-0"
            >
              <h4 className="font-medium">{post.title}</h4>
              <p className="text-sm text-gray-600">
                {post.likes} likes • {post.comments} comments
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Friends */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-3">
          <UserPlus size={20} className="text-primary" />
          <h3 className="font-semibold text-lg">People You May Know</h3>
        </div>
        <div className="space-y-3">
          {suggestedFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-3 border-b pb-2 last:border-0 last:pb-0"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-primary">
                {friend.name[0]}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{friend.name}</h4>
                <p className="text-xs text-gray-600">{friend.course}</p>
              </div>
              <button className="bg-primary text-white px-3 py-1 rounded-full text-xs hover:bg-primary-light">
                Add
              </button>
            </div>
          ))}
        </div>
        <Link
          href="/friends"
          className="text-primary hover:underline text-sm block mt-3"
        >
          See more suggestions
        </Link>
      </div>
    </div>
  );
};

export default RightSidebar;
