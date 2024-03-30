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

const PostCardAnonymous = ({ post }: PostCardProps) => {
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              src="/assets/images/anonymous.png"
              alt="creator"
              className="postProfileImg"
            />
            <span className="postUsername">@anonym</span>

            <span className="postDate">{multiFormatDateString(post.date)}</span>
          </div>
        </div>
        <Link to={`/posts/a/${post.id}`}>
          <div className="postCenter">
            <span className="postText">{post.text}</span>
            {post.photo ? (
              <img
                src={
                  "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/" +
                  post.photo
                }
                alt="post image"
                className="post-card_img"
              />
            ) : (
              <div></div>
            )}
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
            <Link to={`/posts/a/${post.id}`}>
              <span className="postCommentText"> коменти</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardAnonymous;
