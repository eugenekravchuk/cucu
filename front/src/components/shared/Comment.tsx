import { decodeJWT, likeComment } from "@/jwt_back/work";

import { useState } from "react";

const Comment = ({
  username = "loh",
  userImage = "/assets/icons/profile-placeholder.svg",
  time = "25.03",
  text = "some text",
  initialLikes = 0,
  id,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const showDelete = decodeJWT().sub === username;
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = () => {
    try {
      setIsLoading(true);
      likeComment(id);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLiked(!isLiked);
      setIsLoading(false);
      if (isLiked) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }
    }
  };

  // Placeholder for delete functionality
  const handleDelete = () => {
    console.log("Delete comment functionality would go here");
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-5">
      <div className="flex items-center mb-3">
        <img
          src={userImage}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <span className="font-semibold">{username}</span>
          <span className="text-gray-500 text-sm ml-2">{time}</span>
        </div>
        {showDelete ? (
          <div className="w-[100%] flex justify-end mr-5">
            <button
              onClick={handleDelete}
              className="hover:bg-[#EDEDED] w-[30px] h-[30px] flex-center justify-center rounded">
              <img
                src="/assets/icons/delete.svg"
                alt="delete"
                className="w-[24px] h-[24px]"
              />
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="mb-5 mt-5">
        <p>{text}</p>
      </div>
      <div className="flex items-center ">
        <button
          onClick={handleLike}
          className=" text-black hover:bg-[#EDEDED] flex-center font-bold rounded-md">
          <img
            src={isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
            alt="like"
            className="w-[20px] h-[20px] m-1"
          />
        </button>
        <p className="ml-[5px]">{likes}</p>
      </div>
    </div>
  );
};

export default Comment;
