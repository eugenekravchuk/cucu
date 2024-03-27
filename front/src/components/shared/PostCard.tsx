import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { decodeJWT } from "@/jwt_back/work";
import { jwtDecode } from "jwt-decode";
import "./post.css";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="post py-[10px] px-[10px]">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${post.author.username}`}>
              <img
                src={`${
                  post.author.avatar ===
                    "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/" ||
                  post.author.avatar === null
                    ? "/assets/icons/profile-placeholder.svg"
                    : post.author.avatar
                }`}
                alt="creator"
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">@{post.author.username}</span>

            <span className="postDate">{multiFormatDateString(post.date)}</span>
          </div>
          <div className="postTopRight">
            <Link
              to={`/update-post/${post.id}`}
              className={`${decodeJWT().sub !== post.author.id && "hidden"}`}>
              {" "}
              <img
                src={"/assets/icons/edit.svg"}
                alt="edit"
                width={20}
                height={20}
              />
            </Link>
          </div>
        </div>
        <Link to={`/posts/${post.id}`}>
          <div className="postCenter">
            {/* <span className="postText">{post.text}</span> */}
            <div className="postText">{post.text}</div>
            {/* <img className="postImg" src="" alt="" /> */}
            <img
              src={post.photo || "/assets/icons/profile-placeholder.svg"}
              alt="post image"
              className="post-card_img"
            />
          </div>
        </Link>
        <div className="postBottom">
          <div className="postBottomLeft">
            <PostStats
              post={post}
              userId={jwtDecode.id}
              postId={null}
              white={false}
            />
          </div>
          <div className="postBottomRight">
            <Link to={`/posts/${post.id}`}>
              <span className="postCommentText"> Коментарі </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
