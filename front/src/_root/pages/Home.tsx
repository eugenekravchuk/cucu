import { Models } from "appwrite";

// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useToast } from "@/components/ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  decodeJWT,
  getAllPosts,
  isAuthenticated,
  logout,
} from "@/jwt_back/work";

const Home = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching post data:", error);
        // Handle error, e.g., setPost(null) and display error UI
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
          <h2 className="h3-bold md:h2-bold text-left w-full">Стрічка</h2>
          <ul className="flex flex-col flex-1 gap-9 w-full ">
            {posts.map((post: Models.Document) => (
              <li key={post.id} className="flex justify-center w-full">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex-col">
        <div className="home-creators">
          <h3 className="h3-bold text-dark-1">Організації</h3>
          <ul className="grid 2xl:grid-cols-2 gap-3">
            {/* {creators?.documents.map((creator) => (
                <li key={creator?.$id}>
                  <UserCard user={creator} />
                </li>
              ))} */}
          </ul>
        </div>
        <div className="home-creators">
          <h3 className="h3-bold text-dark-1">Категорії</h3>
          <ul className="grid 2xl:grid-cols-2 gap-3">
            {/* {creators?.documents.map((creator) => (
                <li key={creator?.$id}>
                  <UserCard user={creator} />
                </li>
              ))} */}
          </ul>
        </div>
      </div>

      {/* <div className="home-creators">
        <h3 className="h3-bold text-dark-1">Channels</h3>
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
      </div> */}
    </div>
  );
};

export default Home;
