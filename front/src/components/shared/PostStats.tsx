import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import { likePost } from "@/jwt_back/work";
import { Loader } from ".";
type PostStatsProps = {
  post: Models.Document;
  userId: string;
  postId: null;
  white: boolean;
};

const PostStats = ({
  post,
  userId,
  postId = null,
  white = true,
}: PostStatsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likes, setLikes] = useState(post.likes);

  function isInteger(value: any): value is number {
    return typeof value === "number" && Number.isInteger(value);
  }

  const handleLikePost = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    let outcome;
    setIsLoading(true);
    if (isInteger(post.id)) {
      outcome = await likePost(post.id);
    } else {
      outcome = await likePost(postId);
    }

    console.log(outcome);

    setIsLiked(!isLiked);

    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLoading(false);
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  const likeImage = white
    ? "/assets/icons/like_white.svg"
    : "/assets/icons/like.svg";

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-1 mr-5">
        <img
          src={`${isLiked ? "/assets/icons/liked.svg" : likeImage}`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p
          className={`small-medium lg:base-medium ${
            white ? "text-white" : "text-black"
          }`}>
          {likes}{" "}
          <span className="text-[#A3A3A3]">
            {likes === 1 ? `людині сподобалося` : `людям сподобалось `}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PostStats;
