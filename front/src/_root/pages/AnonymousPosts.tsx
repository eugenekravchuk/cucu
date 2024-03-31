import { Models } from "appwrite";
import { Loader } from "@/components/shared";
import { useEffect, useState } from "react";
import { getAllAnonymousPosts } from "@/jwt_back/work";
import PostCardAnonymous from "@/components/shared/PostCardAnonymous";

const AnonymousPosts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getAllAnonymousPosts();
        setPosts(data);
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

  return (
    <div className="flex flex-1">
      <div className="home-container ">
        <div className="home-posts mb-[100px]">
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Анонімні пости
          </h2>
          <ul className="flex flex-col flex-1 gap-9 w-full ">
            {posts.map((post: Models.Document) => (
              <li key={post.id} className="flex justify-center w-full">
                <PostCardAnonymous post={post} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnonymousPosts;
