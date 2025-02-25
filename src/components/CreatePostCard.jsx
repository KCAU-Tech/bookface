"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContextProvider";
import { addDocument } from "@/utils/firestore";
import { bookfaceMediaUpload } from "@/utils/storage";
import Image from "next/image";
import { Camera, Image as ImageIcon, X } from "lucide-react";
import { collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { forbiddenWords } from "@/utils/forbiddenWords";

const MAX_CHARACTER_LIMIT = 5000; // Large but not too large
const MAX_IMAGE_SIZE_MB = 5; // 5MB

const CreatePostCard = ({ userData, onPostCreated }) => {
  const { user } = useAuth();
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    const text = e.target.value;

    // Enforce character limit
    if (text.length > MAX_CHARACTER_LIMIT) {
      return;
    }

    // Check for forbidden words
    if (forbiddenWords.some((word) => text.toLowerCase().includes(word))) {
      setError("Your post contains prohibited content. Please revise.");
      return;
    }

    setPostText(text);
    setError("");
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    // Check file type
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type
      )
    ) {
      setError("Only JPEG, PNG, WebP, and GIF images are allowed");
      return;
    }

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Process image before upload (resize and convert to WebP)
      const processedImage = await processImage(file);
      setSelectedImage(processedImage);
      setError("");
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Failed to process image");
    }
  };

  const processImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        // Use the global window.Image constructor instead of the imported Image component
        const img = new window.Image();

        img.onload = () => {
          // Maximum dimensions for the image
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          let width = img.width;
          let height = img.height;

          // Resize image if needed
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }

          // Create canvas and resize image
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP format with good quality
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create a new file with the processed data
                const processedFile = new File(
                  [blob],
                  `${file.name.split(".")[0]}.webp`,
                  {
                    type: "image/webp",
                    lastModified: new Date().getTime(),
                  }
                );

                resolve({
                  file: processedFile,
                  width,
                  height,
                  sizeBytes: blob.size,
                  contentType: "image/webp",
                });
              } else {
                reject(new Error("Failed to process image"));
              }
            },
            "image/webp",
            0.85
          ); // 0.85 is a good balance of quality vs file size
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };

        img.src = e.target.result;
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createPost = async () => {
    if (!user) return;

    // Validate post text
    if (postText.trim() === "" && !selectedImage) {
      setError("Please enter some text or add an image");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let photoUrl = null;
      let photoMetadata = null;

      // Upload image if there is one
      if (selectedImage) {
        // Create a temporary ID for the post
        const tempPostId = `post_${Date.now()}`;

        // Upload the image to Firebase Storage
        const uploadResult = await bookfaceMediaUpload.postMedia(
          user.uid,
          tempPostId,
          selectedImage.file
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }

        photoUrl = uploadResult.url;
        photoMetadata = {
          width: selectedImage.width,
          height: selectedImage.height,
          sizeBytes: selectedImage.sizeBytes,
          contentType: selectedImage.contentType,
        };
      }

      // Prepare post data
      const postData = {
        userId: user.uid,
        author: {
          name: userData?.firstName + " " + userData?.lastName || "Jane Doe",
          photoURL: userData?.photoURL || null,
        },
        createdAt: serverTimestamp(),
        text: postText,
        textLength: postText.length,
        likes: 0,
        comments: 0,
        tags: extractHashtags(postText),
      };

      // Add photo data if present
      if (photoUrl) {
        postData.photoUrl = photoUrl;
        postData.photoMetadata = photoMetadata;
      }

      // Add post to Firestore
      const result = await addDocument("posts", postData);

      if (!result.success) {
        throw new Error(result.error || "Failed to create post");
      }

      // Reset form
      setPostText("");
      removeSelectedImage();

      // Notify parent component
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract hashtags from text
  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);

    if (!matches) return [];

    return matches.map((tag) => tag.substring(1).toLowerCase());
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        {userData?.photoURL ? (
          <Image
            src={userData.photoURL}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-primary">
            {userData?.firstName?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <div className="flex-1">
          <textarea
            placeholder={`What's on your mind, ${userData?.firstName || "User"}?`}
            className="w-full bg-gray-100 rounded-lg py-2 px-4 resize-none min-h-[60px] focus:outline-none focus:ring-1 focus:ring-primary"
            value={postText}
            onChange={handleTextChange}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Image preview area */}
      {imagePreview && (
        <div className="relative mb-3">
          <div className="rounded-lg overflow-hidden bg-gray-100 relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-auto max-h-[300px] object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
              onClick={removeSelectedImage}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

      <div className="border-t pt-3 flex justify-between items-center">
        <div className="flex">
          <button
            className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-1 rounded-lg"
            onClick={handleImageClick}
            disabled={isSubmitting}
          >
            <ImageIcon size={20} className="text-green-500" />
            <span className="hidden sm:inline">Photo</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
        </div>

        <button
          className="bg-primary text-white px-4 py-1 rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={createPost}
          disabled={
            isSubmitting ||
            (postText.trim() === "" && !selectedImage) ||
            !!error
          }
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePostCard;
