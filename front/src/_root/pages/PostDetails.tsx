import { useParams, Link, useNavigate } from "react-router-dom";
// import { CommentSection } from 'replyke';
import { Button } from "@/components/ui";
import { Loader } from "@/components/shared";
import { GridPostList, PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import {
  decodeJWT,
  deletePost,
  getPostById,
  getProfile,
} from "@/jwt_back/work";
import { useEffect, useState } from "react";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState(null);
  const userdataDecoded = decodeJWT();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getPostById(Number(id));
        setPost(data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
  //   post?.creator.$id
  // );
  // const { mutate: deletePost } = useDeletePost();

  // const relatedPosts = userPosts?.documents.filter(
  //   (userPost) => userPost.$id !== id
  // );

  const handleDeletePost = () => {
    try {
      setIsLoading(true);
      deletePost(post.id);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      navigate(-1);
    }
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img src="/assets/icons/back.svg" alt="back" width={24} height={24} />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      <div className="post_details-card">
        <img src={post.photo} alt="creator" className="post_details-img" />

        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link
              //change
              to={`/profile/${post.author.username}`}
              className="flex items-center gap-3">
              <img
                src={
                  post.author.avatar ==
                  "https://ucummunity-storage.s3.eu-north-1.amazonaws.com/"
                    ? "/assets/icons/profile-placeholder.svg"
                    : post.author.avatar
                }
                alt="creator"
                className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
              />
              <div className="flex gap-1 flex-col">
                <p className="base-medium lg:body-bold text-dark-1">
                  {post.author.username}
                </p>
                <div className="flex-center gap-2 text-dark-3">
                  <p className="subtle-semibold lg:small-regular ">
                    {multiFormatDateString(post.date)}
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex-center gap-4">
              <Link
                to={`/update-post/${post.id}`}
                className={`${
                  userdataDecoded.sub !== post.author.username && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={24}
                  height={24}
                />
              </Link>

              <Button
                onClick={handleDeletePost}
                variant="ghost"
                className={`ost_details-delete_btn ${
                  userdataDecoded.sub !== post.author.username && "hidden"
                }`}>
                <img
                  src={"/assets/icons/delete.svg"}
                  alt="delete"
                  width={24}
                  height={24}
                />
              </Button>
            </div>
          </div>

          <hr className="border w-full border-light-4/80" />

          <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
            <p>{post.text}</p>
            {/* <ul className="flex gap-1 mt-2">
              {post?.tags.map((tag: string, index: string) => (
                <li
                  key={`${tag}${index}`}
                  className="text-dark-3 small-regular">
                  #{tag}
                </li>
              ))}
            </ul> */}
          </div>

          <div className="w-full">
            <PostStats
              post={post}
              userId={userdataDecoded.id}
              postId={id}
              white={false}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-light-4/80" />

        <h4 className="body-bold md:h3-bold w-full my-10">
          Comments
        </h4>
        {/* trying to connect comment section to post */}
        {/* <CommentSection articleId="{id}" /> */}
        {/* {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )} */}
      </div>
    </div>
  );
};

export default PostDetails;
