import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { decodeJWT } from "@/jwt_back/work";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const decodedJWT = decodeJWT();

  return (
    <ul className={`${posts.length > 0 ? "grid-container" : ""} r mb-[100px]`}>
      {posts.length > 0 ? (
        posts.map((post) => (
          <li key={post.id} className="relative min-w-80 h-80">
            <Link to={`/posts/${post.id}`} className="grid-post_link">
              <img
                src={post.photo}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>

            <div className="grid-post_user">
              {showUser && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    src={
                      post.creator.imageUrl ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="line-clamp-1">{post.creator.name}</p>
                </div>
              )}
              {showStats && <PostStats post={post} userId={decodedJWT.id} />}
            </div>
          </li>
        ))
      ) : (
        <p className="text-center w-[100%]">😭 Немає постів 😭</p>
      )}
    </ul>
  );
};

export default GridPostList;
