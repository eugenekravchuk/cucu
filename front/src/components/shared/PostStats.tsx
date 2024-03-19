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
  // const likesList = post.likes.map((user: Models.Document) => user.$id);

  // const [likes, setLikes] = useState<string[]>(post.likes);
  // const [isSaved, setIsSaved] = useState(false);
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

    // let likesArray = [...likes];

    // if (likesArray.includes(userId)) {
    //   likesArray = likesArray.filter((Id) => Id !== userId);
    // } else {
    //   likesArray.push(userId);
    // }

    // setLikes(likesArray);
    // likePost({ postId: post.$id, likesArray });
  };

  // const handleSavePost = (
  //   e: React.MouseEvent<HTMLImageElement, MouseEvent>
  // ) => {
  //   e.stopPropagation();

  //   if (savedPostRecord) {
  //     setIsSaved(false);
  //     return deleteSavePost(savedPostRecord.$id);
  //   }

  //   savePost({ userId: userId, postId: post.$id });
  //   setIsSaved(true);
  // };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

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
          src={`${
            isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"
          }`}
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
            {likes === 1 ? `person liked this post` : `people liked this post `}
          </span>
        </p>
      </div>

      {/*       <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div> */}
    </div>
  );
};

export default PostStats;
