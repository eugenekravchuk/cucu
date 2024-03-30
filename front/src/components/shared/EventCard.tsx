import { Models } from "appwrite";
import { Link, useLocation } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { decodeJWT } from "@/jwt_back/work";
import { jwtDecode } from "jwt-decode";
import "./post.css";

// type PostCardProps = {
//   post: Models.Document;
// };

const EventCard = ({ post, organisation }) => {
  const { pathname } = useLocation();
  return (
    <div className="post py-[10px] px-[10px]">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/organisation/${organisation.id}`}>
              <img
                src={`${
                  organisation.organization_image ===
                    "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/" ||
                    organisation.organization_image === null
                    ? "/assets/icons/profile-placeholder.svg"
                    : organisation.organization_image
                }`}
                alt="creator"
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">{organisation.organization_name}</span>

            <span className="postDate mr-3">{multiFormatDateString(post.event_time_creation)}</span> 
              {pathname.startsWith("/category")? 
              null
              : (
              <div>•
                <span className="postDate ml-3">
                  {post.category.category_name}
                </span>
              </div>
              )}
          </div>
          {/* <div className="postTopRight">
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
          </div> */}
        </div>
        {/* <Link to={`/posts/${post.id}`}> */}
          <div className="postCenter">
            {/* <span className="postText">{post.text}</span> */}
            <div className="postText">{post.event_text}</div>
            <div className="small-medium lg:base-medium py-5">
              <span className="postDate mr-3">Дата проведення: {post.event_date}</span> 
            </div>
            {/* <img className="postImg" src="" alt="" /> */}
            <img
              src={post.event_photo || "/assets/icons/profile-placeholder.svg"}
              alt="post image"
              className="post-card_img"
            />
          </div>
        {/* </Link> */}
        <div className="postBottom">
          {/* <div className="postBottomLeft">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
